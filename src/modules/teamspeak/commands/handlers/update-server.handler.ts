import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateServerCommand } from "../update-server.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Server } from "../../entities/server.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(UpdateServerCommand)
export class UpdateServerHandler implements ICommandHandler<UpdateServerCommand> {
    constructor(
        @InjectRepository(Server) private serverRepository: Repository<Server>
    ) {}

    async execute(command: UpdateServerCommand): Promise<Server> {
        const { serverId, dto } = command;
        const server = await this.serverRepository.findOne({ where: { serverId } });

        if (!server) {
            throw new NotFoundException("Server not found");
        }

        await this.serverRepository.update(serverId, {
            serverIp: dto.serverIp,
            serverPort: dto.serverPort,
            queryName: dto.queryName,
            queryPassword: dto.queryPassword,
            usingDiscordLogging: dto.usingDiscordLogging
        });

        return server;
    }
}