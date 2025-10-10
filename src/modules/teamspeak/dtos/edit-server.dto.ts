export class EditServerDTO {
    serverName: string;
    serverIp: string;
    serverPort: number;
    queryPort: number;
    queryName: string;
    queryPassword: string;
    usingDiscordLogging: boolean;
    discordWebhook?: string;
}