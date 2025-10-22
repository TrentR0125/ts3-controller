import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { SignInCommand } from "../sign-in.command";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GetUserQuery } from "src/modules/user/queries/get-user.query";
import { User } from "src/modules/user/entities/user.entity";
import { compare } from "src/common/utils";
import { JwtPayload } from "src/common/interfaces";
import { LogLevel } from "src/common/enums";
import { AddLogCommand } from "src/modules/events/commands/add-log.command";

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
        private jwtService: JwtService
    ) {}

    async execute(command: SignInCommand): Promise<string> {
        const { emailOrPin, password } = command;
        const user = await this.queryBus.execute(new GetUserQuery(emailOrPin)) as User;

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            await this.commandBus.execute(new AddLogCommand({source:'SignInHandler', logLevel:LogLevel.WARN, loggedAt: new Date(), message:`Sign In attempt for ${user.name} (${user.userId}) - Invalid password`}));

            throw new UnauthorizedException("Password mismatched");
        }
            
        const jwtPayload: JwtPayload = { userId: user.userId, emailAddress: user.email };
        const token = this.jwtService.sign(jwtPayload);
        
        await this.commandBus.execute(new AddLogCommand({source:'SignInHandler', logLevel:LogLevel.INFO, loggedAt: new Date(), message:`Sign In attempt for ${user.name} (${user.userId}) - Signed in Successfully`}));

        return token;
    }
}