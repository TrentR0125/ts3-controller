import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { hash } from "src/common/utils";
import { SignInCommand } from "../commands/sign-in.command";
import { SignInDTO } from "../dtos/sign-in.dto";
import { User } from "src/modules/user/entities/user.entity";
import { GetUserFromTokenQuery } from "../queries/get-user-from-token.query";

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus
    ) {}

    @Get("userFromToken/:token")
    async getUserFromToken(@Param("token") token: string): Promise<User> {
        return await this.queryBus.execute(new GetUserFromTokenQuery(token));
    }

    @Post("sign-in")
    @ApiOkResponse({ type: String })
    async signIn(@Body() dto: SignInDTO): Promise<string> {
        return await this.commandBus.execute(new SignInCommand(dto.email, dto.password)) as string;
    }
}