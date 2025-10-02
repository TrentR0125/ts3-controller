import { ConfigService } from '@nestjs/config';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import * as bcrypt from 'bcrypt';

const ivLength = 12;
const configService = new ConfigService();

// broken
// const secret = configService.get<string>('ENCRYPT_SECRET')
// if (!secret || secret.length !== 32) throw new Error('Encryption Secret not set in environment (.env) or is not 32 characters');

//#region BCRYPT
/**
 * Hash a string (password, API key, etc.) using bcrypt
 */
export async function hash(str: string, saltRounds: number = 10): Promise<string> {
    return await bcrypt.hash(str, saltRounds);
}

/**
 * Compare a string against a bcrypt hash
 */
export async function compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
}
//#endregion

//#region CRYPTO
/**
 * Encrypt a string using AES-256-GCM
 * Returns a string in format: iv:authTag:encrypted
 */
// export function encrypt(str: string): string {
//     const iv = randomBytes(ivLength);
//     // we have this stupid Uint8Array to stop crypto from bitching
//     const cipher = createCipheriv('aes-256-gcm', new Uint8Array(Buffer.from(String(secret), 'utf-8')), new Uint8Array(iv));

//     let encrypted = cipher.update(str, 'utf8', 'hex');
//     encrypted += cipher.final('hex');

//     const authTag = cipher.getAuthTag().toString('hex');
//     return `${iv.toString('hex')}:${authTag}:${encrypted}`;
// }

/**
 * Decrypt a string encrypted with encrypt()
 * @param encryptedText - string in format iv:authTag:encrypted
 * @param key - 32-character secret key (Buffer/hex string)
 */
export function decryptValue(encryptedText: string, key: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

    const iv = new Uint8Array(Buffer.from(ivHex, 'hex'));
    const authTag = new Uint8Array(Buffer.from(authTagHex, 'hex'));

    const decipher = createDecipheriv('aes-256-gcm', new Uint8Array(Buffer.from(key, 'utf-8')), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};
//#endregion