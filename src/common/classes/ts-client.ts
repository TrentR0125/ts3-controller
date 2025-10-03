import { Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TeamSpeak } from "ts3-nodejs-library";

// are we using this as a place holder if we are going to add more servers in the future?
export let tsClient: TeamSpeak;
export class TsClient {
    private static logger: Logger = new Logger("TsClient");

    static async connect(config: ConfigService) {
        tsClient = new TeamSpeak({
            host: config.get<string>("TS_HOST"),
            queryport: config.get<number>('TS_QUERY_PORT') || 10011,
            serverport: config.get<number>("TS_PORT"),
            username: config.get<string>("TS_USER"),
            password: config.get<string>("TS_PASS"),
            nickname: config.get<string>("TS_NICKNAME")
        });

        tsClient.on("ready", () => {
            this.logger.log(`TeamSpeak Client \"${config.get<string>("TS_NICKNAME")}\" is online`);
        });

        tsClient.on("error", (error) => {
            this.logger.error(`Could not start TeamSpeak Client. Error: ${error}`);
        });
    }
}