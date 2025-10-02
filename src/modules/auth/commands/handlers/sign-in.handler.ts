import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { SignInCommand } from "../sign-in.command";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GetUserQuery } from "src/modules/user/queries/get-user.query";
import { User } from "src/modules/user/entities/user.entity";
import { compare } from "src/common/utils";
import { JwtPayload } from "src/common/interfaces";
import { AddLogCommand } from "src/modules/events/commands/add-log.command";
import { LogLevel } from "src/common/enums";

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
    constructor(
        private queryBus: QueryBus,
        private commandBus: CommandBus,
        private jwtService: JwtService
    ) {}

    async execute(command: SignInCommand): Promise<string> {
        const { email, password } = command;

        if (!command) {
            throw new BadRequestException();
        }

        const user = await this.queryBus.execute(new GetUserQuery(email)) as User;

        if (user) {
            const checkPass = await compare(password, user.password);

            if (checkPass) {
                const jwtPayload: JwtPayload = { userId: user.userId, emailAddress: user.email }
                const token = this.jwtService.sign(jwtPayload);

                await this.commandBus.execute(new AddLogCommand({ source: "SignInHandler", logLevel: LogLevel.INFO, loggedAt: new Date(), message: `(${user.userId}) ${user.name} Signed In Successfully` }))

                return token;
            }

            await this.commandBus.execute(new AddLogCommand({ source: "SignInHandler", logLevel: LogLevel.WARN, loggedAt: new Date(), message: `Sign In attempt under (${user.userId}) ${user.name} - Password Mismatch` }))

            throw new UnauthorizedException("Password mismatch");
        }

        throw new NotFoundException("User not found");
    }
}