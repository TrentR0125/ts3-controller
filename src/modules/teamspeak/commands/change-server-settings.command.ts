import { ChangeSettingsDTO } from "../dtos/change-settings.dto";

export class ChangeServerSettingsCommand {
    constructor(public settings: ChangeSettingsDTO) {}
}