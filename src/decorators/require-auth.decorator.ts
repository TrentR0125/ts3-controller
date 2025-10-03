import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiSecurity } from "@nestjs/swagger";
import { API_KEY_HEADER, JWT_TOKEN_HEADER } from "src/common/classes";
import { RequireAuthGuard } from "src/guards/require-auth.guard";

export const CHECK_API_KEY = 'REQUIRE_AUTH';
export const CHECK_JWT_TOKEN = "CHECK_JWT_TOKEN";
export const RequireAuth = (requireJwt: boolean = false) => {
    return applyDecorators(
        SetMetadata(CHECK_API_KEY, true),
        SetMetadata(CHECK_JWT_TOKEN, requireJwt),
        ApiSecurity(API_KEY_HEADER),
        ApiSecurity(JWT_TOKEN_HEADER),
        UseGuards(RequireAuthGuard)
    );
}