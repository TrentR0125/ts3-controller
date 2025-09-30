import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ApiKeySettingsOptions } from "src/common/interfaces/api-key-settings.interface";
import { API_KEY_SETTINGS, } from "src/decorators/api-key.decorator";

@Injectable()
export class ApiKeyGuard extends AuthGuard('api-key') {
    constructor(
        private configService: ConfigService,
        private reflector: Reflector
    ) { super(); }

    canActivate(context: ExecutionContext) {
        const apiKeySettings = this.reflector.get<ApiKeySettingsOptions>(API_KEY_SETTINGS, context.getHandler());
        if (!apiKeySettings)
            return true;

        return super.canActivate(context);
    }

    handleRequest(err, key, info, context: ExecutionContext) {
        const apiKeySettings = this.reflector.get<ApiKeySettingsOptions>(API_KEY_SETTINGS, context.getHandler());
        const { flag } = apiKeySettings;
        const flags = Array.isArray(flag) ? flag : [flag];
        
        if (err || !key)
            throw err || new UnauthorizedException('API Key not found or is invalid');

        const apiKey = key.apiKey;
        const validKeys = flags.map((key) => this.configService.get<string>(`${key}_API_KEY`));

        if (!validKeys.some((validKey) => validKey === apiKey))
            throw new UnauthorizedException('Invalid API Key for route');

        return key;
    }
}