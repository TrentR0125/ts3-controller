import { ApiKeyFlags } from "../enums/api-key-flags.enum";

export interface ApiKeySettingsOptions {
    require?: 'trusted';
    flag: ApiKeyFlags | ApiKeyFlags[];
}