import { Injectable } from "@nestjs/common";
import { tsClient } from "src/common/classes";
import { ServerSettings } from "src/common/interfaces";

@Injectable()
export class TeamSpeakService {
    constructor() {}

    async getServerSettings(): Promise<ServerSettings> {
        return tsClient.serverInfo();
    }
}