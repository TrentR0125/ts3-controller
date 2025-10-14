import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ServerSettings } from "src/common/interfaces";
import { ChangeServerSettingsCommand } from "../commands/change-server-settings.command";
import { ChangeSettingsDTO } from "../dtos/change-settings.dto";
import { KickByUniqueIdCommand } from "../commands/kick-by-unique-id.command";
import { KickByUniqueIdDTO } from "../dtos/kick-by-unique-id.dto";
import { RequireAuth } from "src/decorators/require-auth.decorator";
import { TsConfig } from "../entities/ts-config.entity";
import { Server } from "../entities/server.entity";
import { GetServerQuery } from "../queries/get-server.query";
import { EditServerDTO } from "../dtos/edit-server.dto";
import { UpdateServerCommand } from "../commands/update-server.command";
import { CreateServerDTO } from "../dtos/create-server.dto";
import { CreateServerCommand } from "../commands/create-server.command";
import { DeleteServerCommand } from "../commands/delete-server.command";
import { MoveClientDTO } from "../dtos/move-client.dto";
import { MoveClientCommand } from "../commands/move-client.command";
import { GetChannelIdQuery } from "../queries/get-channel-id.query";

@ApiTags("TeamSpeak")
@Controller('teamspeak')
export class TeamSpeakController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus
    ) {}
    
    @Post("moveClient")
    @RequireAuth(true)
    async moveClient(@Body() dto: MoveClientDTO): Promise<void> {
        await this.commandBus.execute(new MoveClientCommand(dto));
    }

    @Post("create")
    @RequireAuth(true)
    async createServer(@Body() dto: CreateServerDTO): Promise<Server> {
        return await this.commandBus.execute(new CreateServerCommand(dto));
    }

    @Post("kickByUid")
    @RequireAuth(true)
    async kickByUid(@Body() dto: KickByUniqueIdDTO): Promise<void> {
        await this.commandBus.execute(new KickByUniqueIdCommand(dto.uniqueId, dto.reason, dto.serverKick));
    }
    
    @Patch("update/:serverId")
    @RequireAuth(true)
    async updateServer(@Param("serverId") serverId: number, @Body() dto: EditServerDTO): Promise<Server> {
        return await this.commandBus.execute(new UpdateServerCommand(serverId, dto));
    }
    
    @Patch("settings")
    @RequireAuth(true)
    async changeServerSettings(@Body() settings: ChangeSettingsDTO): Promise<ServerSettings> {
        return await this.commandBus.execute(new ChangeServerSettingsCommand(settings));
    }

    @Get("getChannelId/:channelName")
    @ApiOperation({ summary: "Get a channel's ID by the name of the channel" })
    @RequireAuth(true)
    async getChannelId(@Param("channelName") channelName: string): Promise<string> {
        return await this.queryBus.execute(new GetChannelIdQuery(channelName));
    }

    @Get("get/:param")
    @RequireAuth(true)
    async getServer(@Param("param") param: string): Promise<Server> {
        return await this.queryBus.execute(new GetServerQuery(param));
    }

    @Delete("delete/:serverId")
    @RequireAuth(true)
    async deleteServer(@Param("serverId") serverId: number): Promise<void> {
        await this.commandBus.execute(new DeleteServerCommand(serverId));
    }
}