import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class ApiKeyGuard extends AuthGuard('api-key') {
    constructor(
        private configService: ConfigService,
        private reflector: Reflector
    ) { super(); }
}