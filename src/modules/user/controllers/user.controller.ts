import { Controller, Get, Param } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { ApiKeySettings } from "src/decorators/api-key.decorator";
import { ApiKeyFlags } from "src/common/enums/api-key-flags.enum";
import { QueryBus } from "@nestjs/cqrs";
import { GetUserQuery } from "../queries/get-user.query";

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(
        private queryBus: QueryBus
    ) {}

    @Get("get/:params")
    @ApiOkResponse({ type: User  })
    @ApiOperation({ summary: "Get a user by any paramater (userId, email, and teamspeakId)" })
    async getUser(@Param("params") params: string): Promise<User> {
        return await this.queryBus.execute(new GetUserQuery(params));
    }
}