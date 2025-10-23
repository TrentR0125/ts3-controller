import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllLogsQuery } from "../get-all-logs.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "../../entities/log.entity";
import { Repository } from "typeorm";

@QueryHandler(GetAllLogsQuery)
export class GetAllLogsHandler implements IQueryHandler<GetAllLogsQuery> {
    constructor(
        @InjectRepository(Log) private logRepository: Repository<Log>
    ) {}

    async execute(query: GetAllLogsQuery): Promise<Log[]> {
        return await this.logRepository.find({});
    }
}