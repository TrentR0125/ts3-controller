import { SetMetadata } from "@nestjs/common";

export const REQUIRE_JWT = 'isPublicJwt';
export const SkipJwt = () => SetMetadata(REQUIRE_JWT, true);