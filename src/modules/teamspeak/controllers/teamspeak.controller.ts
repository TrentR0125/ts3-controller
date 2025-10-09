import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ServerSettings } from "src/common/interfaces";
import { ChangeServerSettingsCommand } from "../commands/change-server-settings.command";
import { ChangeSettingsDTO } from "../dtos/change-settings.dto";
import { KickByUniqueIdCommand } from "../commands/kick-by-unique-id.command";
import { KickByUniqueIdDTO } from "../dtos/kick-by-unique-id.dto";
import { RequireAuth } from "src/decorators/require-auth.decorator";
import { TsConfig } from "../entities/ts-config.entity";
import { Server } from "../entities/server.entity";
import { GetServerQuery } from "../queries/get-server.query";

@ApiTags("TeamSpeak")
@Controller('teamspeak')
export class TeamSpeakController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus
    ) {}

    @Get("get/:serverId")
    @RequireAuth(true)
    async getServer(@Param("serverId") serverId: number): Promise<Server> {
        return await this.queryBus.execute(new GetServerQuery(serverId));
    }

    @Post("kickByUid")
    @RequireAuth(true)
    async kickByUid(@Body() dto: KickByUniqueIdDTO): Promise<void> {
        await this.commandBus.execute(new KickByUniqueIdCommand(dto.uniqueId, dto.reason, dto.serverKick));
    }

    @Patch("settings")
    @RequireAuth(true)
    async changeServerSettings(@Body() settings: ChangeSettingsDTO): Promise<ServerSettings> {
        return await this.commandBus.execute(new ChangeServerSettingsCommand(settings));
    }
}