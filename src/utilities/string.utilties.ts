// RMW: this is probably some of the worst code I've written if you can shorten it down or have a better solution I'm open to ideas.

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

    // Start with lowercase + digits by default
    let chars = lower + digits;

    // Add uppercase letters if requested
    if (usingCaps) chars += upper;

    // Add special characters if requested
    if (usingSpecialChars) chars += special;

    // Build the random string
    let result = '';
    for (let i = 0; i < length; i++) {
        // Pick a random index from the allowed characters
        const index = Math.floor(Math.random() * chars.length);
        result += chars[index];
    }

    return result;
}
