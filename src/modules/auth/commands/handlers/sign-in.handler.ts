import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { SignInCommand } from "../sign-in.command";
import { NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GetUserQuery } from "src/modules/user/queries/get-user.query";
import { User } from "src/modules/user/entities/user.entity";
import { compare, LogUtils } from "src/common/utils";
import { JwtPayload } from "src/common/interfaces";
import { LogLevel } from "src/common/enums";

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
    constructor(
        private log: LogUtils,
        private queryBus: QueryBus,
        private jwtService: JwtService
    ) {}

    async execute(command: SignInCommand): Promise<string> {
        const { email, password } = command;

        const user = await this.queryBus.execute(new GetUserQuery(email)) as User;
        if (!user)
            throw new NotFoundException('User not found');

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid)
            await this.log.addLog('SignInHandler', LogLevel.WARN, `Sign In attempt for ${user.name} (${user.userId}) - Invalid password`);
            
        const jwtPayload: JwtPayload = { userId: user.userId, emailAddress: user.email };
        const token = this.jwtService.sign(jwtPayload);
        
        await this.log.addLog('SignInHandler', LogLevel.INFO, `Sign In attempt for ${user.name} (${user.userId}) - Signed in Successfully`);
        return token;
    }
}