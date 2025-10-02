import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ServerSettings } from "src/common/interfaces";
import { ChangeServerSettingsCommand } from "../commands/change-server-settings.command";
import { ChangeSettingsDTO } from "../dtos/change-settings.dto";
import { KickByUniqueIdCommand } from "../commands/kick-by-unique-id.command";
import { KickByUniqueIdDTO } from "../dtos/kick-by-unique-id.dto";

@ApiTags("TeamSpeak")
@ApiSecurity("x-tsc-apikey")
@Controller('teamspeak')
export class TeamSpeakController {
    constructor(
        private commandBus: CommandBus
    ) {}

    @Post("kickByUid")
    async kickByUid(@Body() dto: KickByUniqueIdDTO): Promise<void> {
        await this.commandBus.execute(new KickByUniqueIdCommand(dto.uniqueId, dto.reason, dto.serverKick));
    }

    @Patch("settings")
    async changeServerSettings(@Body() settings: ChangeSettingsDTO): Promise<ServerSettings> {
        return await this.commandBus.execute(new ChangeServerSettingsCommand(settings));
    }
}