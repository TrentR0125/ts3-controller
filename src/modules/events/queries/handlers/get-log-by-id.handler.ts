import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLogByIdQuery } from "../get-log-by-id.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "../../entities/log.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

@QueryHandler(GetLogByIdQuery)
export class GetLogByIdHandler implements IQueryHandler<GetLogByIdQuery> {
    constructor(
        @InjectRepository(Log) private logRepo: Repository<Log>
    ) {}

    async execute(query: GetLogByIdQuery): Promise<Log> {
        const log = await this.logRepo.findOne({ where: { eventId: query.eventId } });

        if (!log) {
            throw new NotFoundException("Log not found");
        }

        return log;
    }
}