import { SetMetadata } from "@nestjs/common";
import { ApiKeySettingsOptions } from "src/common/interfaces/api-key-settings.interface";

export const API_KEY_SETTINGS = 'API_KEY_SETTINGS';
export const ApiKeySettings = (options: ApiKeySettingsOptions) => SetMetadata(API_KEY_SETTINGS, options);