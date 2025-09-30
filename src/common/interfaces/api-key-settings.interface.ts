import { ApiKeyFlags } from "../../common/enums/api-key-flags.enum";

export interface ApiKeySettingsOptions {
    require?: 'trusted';
    flag: ApiKeyFlags | ApiKeyFlags[];
}