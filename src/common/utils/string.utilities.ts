// RMW: this is probably some of the worst code I've written if you can shorten it down or have a better solution I'm open to ideas.
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as boolUtils from "./boolean.utilities";

const logger = new Logger('StringUtilities');

/**
 * Generate a random string with optional capitalization and special characters.
 * Useful for passwords, tokens, or API keys.
 *
 * @param length - Desired length of the generated string (default: 12)
 * @param usingSpecialChars - Include special characters if true (default: false)
 * @param usingCaps - Include uppercase letters if true (default: false)
 * @returns A randomly generated string
 */
export function generateString(length: number = 12, usingSpecialChars: boolean = false, usingCaps: boolean = false): string {
    // Character sets
    const lower = 'abcdefghijklmnopqrstuvwxyz';   // lowercase letters
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';   // uppercase letters
    const digits = '0123456789';                  // digits 0-9
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'; // special characters

    let chars = lower + digits; // start with lowercase + digits by default

    
    if (usingCaps) chars += upper; // add uppercase letters if requested
    if (usingSpecialChars) chars += special; // add special characters if requested

    // build the random string
    let result = '';
    for (let i = 0; i < length; i++) {
        // pick a random index from the allowed characters
        const index = Math.floor(Math.random() * chars.length);
        result += chars[index];
    }

    logger.log('Created random string:', result);

    return result;
}

/**
* Retrieves an environment variable. If it is missing (null, undefined, or empty), 
* it throws a configuration error. This is MANDATORY for critical settings like API keys.
* @param configService The NestJS ConfigService instance.
* @param key The environment variable key to retrieve.
* @returns The non-empty string value of the environment variable.
*/
export function getEnvOrThrow(configService: ConfigService, key: string) {
    const val = configService.get<string>(key);
    if (!val || val.trim().length === 0)
        throw new Error(`[CONFIG ERROR] Mandatory environment variable '${key}' is missing or empty.`);

    return val;
}

/**
* Converts a string into a URL-friendly slug (e.g., 'Hello World!' -> 'hello-world').
* Useful for creating clean database IDs, file names, or URL paths.
* @param text The input string.
* @returns A sanitized, lowercase, hyphen-separated string.
*/
export function toSlug(text: string): string {
    return text.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // remove all non-word chars except spaces and hyphens
        .replace(/[\s_-]+/g, '-') // replace spaces and repeated hyphens/underscores with a single hyphen
        .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}

/**
* Capitalizes the first letter of a string.
* @param text The input string.
* @returns The string with the first letter capitalized, or an empty string if input is null/empty.
*/
export function capitalize(text: string): string {
    
    if (boolUtils.isNullOrWhiteSpace(text))
        return '';
    
    const safeText = text.trim();
    // only capitalize the first character, keep the rest as they are (preserving casing if it exists)
    return safeText.charAt(0).toUpperCase() + safeText.slice(1);
}

/**
* Truncates a string to a specified maximum length, adding a suffix if truncated.
* Useful for UI displays, logs, and database previews.
* @param text The input string.
* @param maxLength The maximum length before truncation.
* @param suffix The suffix to append if truncation occurs (default: '...').
* @returns The truncated or original string.
*/
export function truncate(text: string, maxLength: number = 50, suffix: string = '...'): string {
    
    if ((text) || text.length <= maxLength) {
        return text;
    }

    // determine the safe length to cut the string, leaving room for the suffix
    const safeMaxLength = maxLength - suffix.length;

    if (safeMaxLength <= 0) {
        // if maxLength is too small for any content + suffix, return just the maxLength part of the text
        return text.slice(0, maxLength); 
    }

    // slice the text, trim any resulting whitespace from the end, and add the suffix
    return text.slice(0, safeMaxLength).trim() + suffix;
}
