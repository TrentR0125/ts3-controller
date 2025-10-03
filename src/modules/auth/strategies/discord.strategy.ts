import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy as DiscordStrategyBase } from "passport-discord";
import { ExtendedDiscordProfile } from "src/common/interfaces/extended-discord-profile.interface";

@Injectable()
export class DiscordStrategy extends PassportStrategy(DiscordStrategyBase, 'discord') {
    constructor(config: ConfigService) {
        super({
            clientID: config.get<string>('DISCORD_CID'),
            clientSecret: config.get<string>('DISCORD_SECRET'),
            callbackURL: `${config.get<string>('DISCORD_CALLBACK_URL')}/api/discord/callback`,
            scope: ['identify', 'email', 'guilds', 'guilds.join'],
        } as any);
    }

    async validate(accessToken: string, refreshToken: string, profile: ExtendedDiscordProfile, done: Function): Promise<any> {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        done(null, profile);
    }
}