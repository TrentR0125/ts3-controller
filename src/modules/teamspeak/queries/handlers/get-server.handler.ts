import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetServerQuery } from "../get-server.query";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Server } from "../../entities/server.entity";

@QueryHandler(GetServerQuery)
export class GetServerHandler implements IQueryHandler<GetServerQuery> {
    constructor(
        @InjectRepository(Server) private serverRepository: Repository<Server> 
    ) {}

    async execute(query: GetServerQuery): Promise<Server> {
        const serverId = query.serverId;
        
        if (!serverId) {
            throw new BadRequestException("Invalid Server ID");
        }
        
        const server = await this.serverRepository.findOne({ where: { serverId }});

        if (!server) {
            throw new NotFoundException("Server not found");
        }

        return server;
    }
}