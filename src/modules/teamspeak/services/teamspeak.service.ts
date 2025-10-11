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
    constructor(
        @InjectRepository(Server)
        private serverRepository: Repository<Server>,
        private logService: LogService
    ) { }

    private configService = new ConfigService;

    async getServerSettings(): Promise<ServerSettings> {
        return tsClient.serverInfo();
    }

    async kickClientByUid(dto: KickByUniqueIdDTO) {
        try {
            const client = await tsClient.getClientByUid(dto.uniqueId);
            if (!client)
                throw new NotFoundException('Client not found');

            if (dto.serverKick) {
                client.kickFromServer(dto.reason);
            } else {
                client.kickFromChannel(dto.reason);
            }

            await this.logService.addLog({
                source: 'TeamSpeakService',
                logLevel: LogLevel.INFO,
                message: `Successfully kicked client: ${client.nickname} (${client.clid})`,
                loggedAt: new Date()
            });
        } catch (err) {
            await this.logService.addLog({
                source: 'TeamSpeakService',
                logLevel: LogLevel.ERROR,
                message: `Failed to kick client: ${err}`,
                loggedAt: new Date()
            });
        }
    }
}