import { Body, Controller, Patch } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ServerSettings } from "src/common/interfaces";
import { ChangeServerSettingsCommand } from "../commands/change-server-settings.command";
import { ChangeSettingsDTO } from "../dtos/change-settings.dto";

@ApiTags("TeamSpeak")
@ApiSecurity("x-tsc-apikey")
@Controller('teamspeak')
export class TeamSpeakController {
    constructor(
        private commandBus: CommandBus
    ) {}

    @Patch("settings")
    async changeServerSettings(@Body() settings: ChangeSettingsDTO): Promise<ServerSettings> {
        return await this.commandBus.execute(new ChangeServerSettingsCommand(settings));
    }
}