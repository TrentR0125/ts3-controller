import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { QueryBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { API_KEY_HEADER, JWT_TOKEN_HEADER } from "src/common/classes";
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
        const handler = context.getHandler();
        const checkApiKey = this.reflector.get<boolean>(CHECK_API_KEY, handler);
        const checkJwt = this.reflector.get<boolean>(CHECK_JWT_TOKEN, handler);

        if (checkApiKey)
            return this.validateApiKeyAndToken(context, checkJwt);

        return true;
    }

    private async validateApiKeyAndToken(context: ExecutionContext, checkJwt: boolean): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const apiKey = req.headers[API_KEY_HEADER] as string;

        if (!apiKey || apiKey !== this.configService.get<string>('API_KEY'))
            throw new UnauthorizedException('API key has been rejected or is not set');

        if (checkJwt)
            return this.validateJwt(req.headers[JWT_TOKEN_HEADER] as string);

        return true;
    }

    private async validateJwt(token?: string): Promise<boolean> {
        if (!token)
            throw new UnauthorizedException('JWT is missing');

        const user = await this.queryBus.execute(new GetUserFromTokenQuery(token)) as User;
        if (!user)
            throw new UnauthorizedException('JWT is invalid')

        return true;
    }
}