import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteServerCommand } from "../delete-server.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Server } from "../../entities/server.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(DeleteServerCommand)
export class DeleteServerHandler implements ICommandHandler<DeleteServerCommand> {
    constructor(
        @InjectRepository(Server) private serverRepo: Repository<Server>
    ) {}

    async execute(command: DeleteServerCommand): Promise<void> {
        const serverId = command.serverId;
        const server = await this.serverRepo.findOne({ where: { serverId } });

        if (!server) {
            throw new NotFoundException("Server not found");
        }

        await this.serverRepo.delete(serverId); // i switched it to perma delete instead of having deleted servers laying in the db
    }
}