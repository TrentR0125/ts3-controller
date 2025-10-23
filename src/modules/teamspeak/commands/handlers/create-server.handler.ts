import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateServerCommand } from "../create-server.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Server } from "../../entities/server.entity";
import { Repository } from "typeorm";
import { ConflictException, HttpException } from "@nestjs/common";
import { hash } from "src/common/utils";

@CommandHandler(CreateServerCommand)
export class CreateServerHandler implements ICommandHandler<CreateServerCommand> {
    constructor(
        @InjectRepository(Server) private serverRepo: Repository<Server>
    ) {}

    async execute(command: CreateServerCommand): Promise<Server> {
        const dto = command.dto;
        const exists = await this.serverRepo.findOne({ where: { serverIp: dto.serverIp, serverPort: dto.serverPort } });

        if (exists) {
            throw new ConflictException("Server already exists");
        }

        dto.queryPassword = (await hash(dto.queryPassword)).toString(); // safety reasons

        return await this.serverRepo.save({ serverId: 0, ...dto });
    }
}