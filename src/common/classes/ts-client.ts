import { Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QueryBus } from "@nestjs/cqrs";
import { TeamSpeak } from "ts3-nodejs-library";

// are we using this as a place holder if we are going to add more servers in the future?
// ^ Yes, i was just going to do it this way for now until later down the road, then we can mess with connecting to more than 1 server. I mostly want to get a frontend up or something before moving onto that. - Trent
export let tsClient: TeamSpeak;
export class TsClient {
    private static logger: Logger = new Logger("TsClient");

    static async connect(config: ConfigService, queryBus: QueryBus) {
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