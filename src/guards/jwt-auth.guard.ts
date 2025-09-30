import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeySettingsOptions } from 'src/common/interfaces/api-key-settings.interface';
import { API_KEY_SETTINGS } from 'src/decorators/api-key.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) { super(); }

    canActivate(context: ExecutionContext) {
        const apiKeySettings = this.reflector.get<ApiKeySettingsOptions>(API_KEY_SETTINGS, context.getHandler());
        if (!apiKeySettings)
            return true;

        const { require } = apiKeySettings;
        if (require !== 'trusted')
            return true;

        return super.canActivate(context);
    }
}