import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { QueryBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { API_KEY_HEADER, JWT_TOKEN_HEADER } from "src/common/classes";
import { ApiKeySettingsOptions } from "src/common/interfaces/api-key-settings.interface";
import { CHECK_API_KEY, CHECK_JWT_TOKEN } from "src/decorators/require-auth.decorator";
import { GetUserFromTokenQuery } from "src/modules/auth/queries/get-user-from-token.query";
import { User } from "src/modules/user/entities/user.entity";

@Injectable()
export class RequireAuthGuard extends AuthGuard("jwt") implements CanActivate {
    constructor(
        private configService: ConfigService,
        private reflector: Reflector,
        private queryBus: QueryBus
    ) { super(); }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const checkApiKey = this.reflector.get<boolean>(CHECK_API_KEY, context.getHandler());
        const checkJwtToken = this.reflector.get<boolean>(CHECK_JWT_TOKEN, context.getHandler());

        if (checkApiKey) {
            const req = context.switchToHttp().getRequest() as Request;
            const apiKey = req.headers[API_KEY_HEADER] as string;
            
            if (apiKey && apiKey == this.configService.get<string>("API_KEY")) {
                if (checkJwtToken) {
                    const token = req.headers[JWT_TOKEN_HEADER] as string;

                    if (token) {
                        const user = await this.queryBus.execute(new GetUserFromTokenQuery(token)) as User;

                        if (user) {
                            return true;
                        }
                    }

                    throw new UnauthorizedException("JWT Token is invalid");
                }

                return true;
            }

            throw new UnauthorizedException("API Key is invalid");
        }

        return true;
    }
}