import { TeamSpeak } from "ts3-nodejs-library";

export let tsClient: TeamSpeak;
export class TsClient {
    async connect() {
        tsClient = new TeamSpeak({
            host: "",
            queryport: 10001,
            serverport: 9987,
            username: "serveradmin",
            password: "",
            nickname: "TS3 Controller"
        });

        tsClient.on("ready", () => {
            // uhhhh do something cool
        });
    }
}