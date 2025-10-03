import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { ApiOkResponse, ApiOperation, ApiProperty, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetUserQuery } from "../queries/get-user.query";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { CreateUserCommand } from "../commands/create-user.command";
import { RequireAuth } from "src/decorators/require-auth.decorator";

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(
        private queryBus: QueryBus,
        private commandBus: CommandBus
    ) {}

    @Post("create")
    @RequireAuth(true)
    @ApiOkResponse({ type: User })
    async createUser(@Body() dto: CreateUserDTO): Promise<User> {
        return await this.commandBus.execute(new CreateUserCommand(dto));
    }

    @Get("get/:params")
    @RequireAuth(true)
    @ApiOkResponse({ type: User  })
    @ApiOperation({ summary: "Get a user by any paramater (userId, email, and teamspeakId)" })
    async getUser(@Param("params") params: string): Promise<User> {
        return await this.queryBus.execute(new GetUserQuery(params));
    }
}