import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const logger = new Logger('BooleanUtilities');

/**
 * Derives the boolean 'usingDiscord' based on the presence of required 
 * Discord environment variables. This function uses the injected 
 * ConfigService to check the environment.
*/
export function isDiscordConfigured(configService: ConfigService): boolean {
    const cid = configService.get<string>('DISCORD_CID');
    const secret = configService.get<string>('DISCORD_SECRET');
    const callbackUrl = configService.get<string>('DISCORD_CALLBACK_URL');

    const isConfigured = !!cid && cid.trim().length > 0 &&
        !!secret && secret.trim().length > 0 &&
        !!callbackUrl && callbackUrl.trim().length > 0;

    if (isConfigured) logger.log('Derived setting: usingDiscord is TRUE (All Discord ENV vars found).');
    else logger.log('Derived setting: usingDiscord is FALSE (One or more Discord ENV vars are missing/empty).');

    return isConfigured;
}

/**
* Checks if the current environment (API_ENV) matches the specified type 
* and logs the detected environment type.
* @param configService The NestJS ConfigService instance.
* @param env The specific environment type ('production', 'development', or 'staging') to check against.
*/
export function isEnvType(configService: ConfigService, env: 'production' | 'development' | 'staging'): boolean {
    const envType = configService.get<string>('API_ENV', 'development'); // default development environment
    const normalizedEnv = envType.toLowerCase();
    
    // log the environment type on detection
    switch (normalizedEnv) {
        case 'production': logger.warn('Running in PRODUCTION environment.'); break;
        case 'development': logger.log('Running in DEVELOPMENT environment.'); break;
        case 'staging': logger.log('Running in STAGING environment.'); break;
        default: logger.warn(`Running in Unknown environment type: ${envType}. Defaulting to DEVELOPMENT behavior.`); break;
    }

    // return the boolean result of the specific check
    return normalizedEnv === env;
}

/**
* Checks if a string is null, undefined, or consists only of whitespace characters.
* This is an essential utility for data validation.
* @param str The input string (can be null or undefined).
* @returns True if the string is empty or whitespace only, false otherwise.
*/
export function isNullOrWhiteSpace(str: string | null | undefined): boolean {
    return str === null || str === undefined || str.trim().length === 0;
}