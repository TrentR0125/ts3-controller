import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetServerQuery } from "../get-server.query";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Server } from "../../entities/server.entity";
import { isBooleanObject } from "util/types";

@QueryHandler(GetServerQuery)
export class GetServerHandler implements IQueryHandler<GetServerQuery> {
    constructor(
        @InjectRepository(Server) private serverRepository: Repository<Server> 
    ) {}

    // i just took this from the get user query and slapped it on here 🤷
    async execute(query: GetServerQuery): Promise<Server | Server[]> {
        const param = query.serverParam;

        if (!param) {
            throw new BadRequestException();
        }

        const where: any[] = [];

        if (!isNaN(Number(param))) {
            where.push({ serverId: Number(param) });
        }

        where.push({ serverIp: String(param) });
        where.push({ containerId: String(param) });

        const server = await this.serverRepository.find({ where });

        if (!server || server.length == 0) {
            throw new NotFoundException();
        }

        return server.length == 1 ? server[0] : server;
    }
}