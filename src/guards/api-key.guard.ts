import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ApiKeySettingsOptions } from "src/common/interfaces/api-key-settings.interface";
import { API_KEY_SETTINGS, } from "src/decorators/api-key.decorator";

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private reflector: Reflector
    ) {  }

    // i moved some stuff around because it would throw a big error in the console if the request was unauthorized.
    // both the original and current code dont work for some reason. I cant seem to figure it out, the API Key is fine it just keeps throwing unauthorized.
    canActivate(context: ExecutionContext): boolean {
        const apiKeySettings = this.reflector.get<ApiKeySettingsOptions>(API_KEY_SETTINGS, context.getHandler());

        if (!apiKeySettings) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const apiKey = req.headers["x-tsc-apikey"];

        console.log(req.headers);
        
        if (!apiKey)
            throw new UnauthorizedException('API Key not found or is invalid');
        
        const { flag } = apiKeySettings;
        const flags = Array.isArray(flag) ? flag : [flag];
        const validKeys = flags.map((key) => this.configService.get<string>(`${key}_API_KEY`));
        
        if (!validKeys.some((validKey) => validKey === apiKey))
            throw new UnauthorizedException('Invalid API Key for route');
        
        return true;
    }
}