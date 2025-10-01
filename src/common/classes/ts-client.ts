import { ConfigService } from "@nestjs/config";
import { TeamSpeak } from "ts3-nodejs-library";

export let tsClient: TeamSpeak;
export class TsClient {
    static async connect(config: ConfigService) {
        tsClient = new TeamSpeak({
            host: config.get<string>("TS_HOST"),
            queryport: 10011,
            serverport: config.get<number>("TS_PORT"),
            username: config.get<string>("TS_USER"),
            password: config.get<string>("TS_PASS"),
            nickname: config.get<string>("TS_NICKNAME")
        });

        tsClient.on("ready", () => {
            // uhhhh do something cool
        });
    }
}