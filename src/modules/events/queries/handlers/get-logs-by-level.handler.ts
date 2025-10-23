import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLogsByLevelQuery } from "../get-logs-by-level.query";
import { Log } from "../../entities/log.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LogService } from "../../services/log.service";

@QueryHandler(GetLogsByLevelQuery)
export class GetLogsByLevelHandler implements IQueryHandler<GetLogsByLevelQuery> {
    constructor(private logService: LogService) {}

    async execute(query: GetLogsByLevelQuery): Promise<Log[]> {
        return await this.logService.getLogsByField('logLevel', query.level);
    }
}