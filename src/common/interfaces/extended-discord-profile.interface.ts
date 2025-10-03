import { Profile } from 'passport-discord';

export interface ExtendedDiscordProfile extends Profile {
    accessToken?: string;
    refreshToken?: string;
}