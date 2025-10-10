import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ChangeServerSettingsCommand } from "../change-server-settings.command";
import { BadRequestException } from "@nestjs/common";
import { tsClient } from "src/common/classes";
import { ServerSettings } from "src/common/interfaces";
import { TeamSpeakService } from "../../services/teamspeak.service";

@CommandHandler(ChangeServerSettingsCommand)
export class ChangeServerSettingsHandler implements ICommandHandler<ChangeServerSettingsCommand> {
    constructor(
        private teamspeakService: TeamSpeakService
    ) {}

    async execute(command: ChangeServerSettingsCommand): Promise<ServerSettings> {
        const settings = command.settings

        if (!settings) {
            throw new BadRequestException();
        }

        await tsClient.serverEdit
        (
            {  
                // im just doing these few for now
                virtualserverName: settings.virtualserverName,
                virtualserverWelcomemessage: settings.virtualserverWelcomemessage,
                virtualserverPassword: settings.virtualserverPassword
            }
        );

        return this.teamspeakService.getServerSettings();
    }
}