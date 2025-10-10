import { Injectable, NotFoundException } from "@nestjs/common";
import { tsClient } from "src/common/classes";
import { ServerSettings } from "src/common/interfaces";
import { Server } from "../entities/server.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateServerDTO } from "../dtos/create-server.dto";
import { EditServerDTO } from "../dtos/edit-server.dto";

@Injectable()
export class TeamSpeakService {
    constructor(
        @InjectRepository(Server)
        private serverRepository: Repository<Server>
    ) { }

    async getServerSettings(): Promise<ServerSettings> {
        return tsClient.serverInfo();
    }
}