import { BadRequestException, Injectable } from "@nestjs/common";
import { existsSync, readFileSync, writeFile, writeFileSync } from "fs";
import { join } from "path";

@Injectable()
export class SetupService {
    private envPath = join(process.cwd(), '.env');
    private envExamplePath = join(process.cwd(), '.env.example');

    generateEnvContent(payload: Record<string, string | undefined>): string {
        const lines: string[] = [];

        const keys = [
            'API_ENV', 'API_HOST', 'API_PORT', 'API_KEY', 'JWT_SECRET',
            'MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE',
            'DISCORD_CID', 'DISCORD_SECRET', 'DISCORD_CALLBACK_URL',
            'TS_HOST', 'TS_PORT', 'TS_QUERY_PORT', 'TS_USER', 'TS_PASS', 'TS_NICKNAME'
        ];

        for (const key of keys) {
            const val = payload[key] ?? '';
            lines.push(`${key}=${val}`);
        }

        return lines.join('\n') + '\n';
    }

    applyConfig(payload: Record<string, any>) {
        if (!payload) throw new BadRequestException('No configuration provided');

        const envLines: string[] = [];

        for (const key of Object.keys(payload)) {
            const val = payload[key];
            envLines.push(`${key}=${this.escapeEnv(val)}`);
        }

        writeFileSync(this.envPath, envLines.join('\n') + '\n', { encoding: 'utf8', mode: 0o600 });
        return { ok: true };
    }

    /**
     * Intentionally immediate exit. The frontend will call this AFTER showing countdown.
     * Useful: flush logs if needed, then exit.
     * Note: this will stop the Node process.
     */
    restartProcess() {
        setTimeout(() => {
            console.log('SetupService: exiting process for restart (exit 0)');
            process.exit(0);
        }, 100); // tiny delay to allow the HTTP response to be sent
    }

    private escapeEnv(value: string) {
        if (!value) return '';
        if (/[ \t$"'`]/.test(value)) {
            return `"${value.replace(/"/g, '\\"')}"`;
        }
        return value;
    }
}