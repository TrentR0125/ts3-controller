import { Injectable, NotFoundException } from "@nestjs/common";
import { tsClient } from "src/common/classes";
import { ServerSettings } from "src/common/interfaces";
import { Server } from "../entities/server.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateServerDTO } from "../dtos/create-server.dto";
import { EditServerDTO } from "../dtos/edit-server.dto";
import { KickByUniqueIdDTO } from "../dtos/kick-by-unique-id.dto";
import { LogService } from "src/modules/events/services/log.service";
import { ConfigService } from "@nestjs/config";
import { LogLevel } from "src/common/enums";

@Injectable()
export class TeamSpeakService {
    async getServerSettings(): Promise<ServerSettings> {
        return tsClient.serverInfo();
    }
}