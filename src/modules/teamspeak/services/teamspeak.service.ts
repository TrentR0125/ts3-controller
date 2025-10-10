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

    async getServerById(serverId: number): Promise<Server> {
        const server = await this.serverRepository.findOneBy({ serverId });
        if (!server)
            throw new NotFoundException('Server not found');

        return server;
    }

    async getServerByContainerId(containerId: string): Promise<Server> {
        const server = await this.serverRepository.findOne({ where: { containerId, usePelicanOrPtero: true } });
        if (!server)
            throw new NotFoundException('Server not found');

        return server;
    }

    async getServersByIp(serverIp: string): Promise<Server[]> {
        const servers = await this.serverRepository.find({ where: { serverIp } });
        if (!servers.length)
            throw new NotFoundException('Server(s) not found');

        return servers;
    }

    async getServerByPort(serverPort: number): Promise<Server> {
        const server = await this.serverRepository.findOneBy({ serverPort });
        if (!server)
            throw new NotFoundException('Server not found');

        return server;
    }

    async getDeletedServers(): Promise<Server[]> {
        const servers = await this.serverRepository.find({ where: { isDeleted: true } });
        if (!servers.length)
            throw new NotFoundException('Deleted servers not found');

        return servers;
    }

    async createServer(dto: CreateServerDTO) {

    }

    async updateServer(serverId: number, dto: EditServerDTO): Promise<Server> {
        const server = await this.serverRepository.findOneBy({ serverId });
        if (!server)
            throw new NotFoundException('Server not found');

        await this.serverRepository.update(serverId, {
            serverIp: dto.serverIp,
            serverPort: dto.serverPort,
            queryName: dto.queryName,
            queryPassword: dto.queryPassword,
            usingDiscordLogging: dto.usingDiscordLogging
        });

        return server;
    }

    async deleteServer(serverId: number) {
        const server = await this.serverRepository.findOneBy({ serverId });
        if (!server)
            throw new NotFoundException('Server not found');

        const deletedServer = await this.serverRepository.update(serverId, { isDeleted: true });
        return deletedServer;
    }

}