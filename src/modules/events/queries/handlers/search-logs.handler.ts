import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchLogsQuery } from "../search-logs.query";
import { Log } from "../../entities/log.entity";
import { BadRequestException } from "@nestjs/common";
import { Between, ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@QueryHandler(SearchLogsQuery)
export class SearchLogsHandler implements IQueryHandler<SearchLogsQuery> {
    constructor(
        @InjectRepository(Log) private logRepository: Repository<Log>
    ) {}

    async execute(query: SearchLogsQuery): Promise<Log[]> {
        const dto = query.dto;

        if (!dto.from || !dto.to) {
            throw new BadRequestException('Start date and end date are required');
        }

        const where: any = { loggedAt: Between(dto.from, dto.to) };

        if (dto.logLevel) where.logLevel = dto.logLevel;
        if (dto.source) where.source = dto.source;
        if (dto.searchPhrase?.trim()) where.message = ILike(`%${dto.searchPhrase}%`);

        const logs = await this.logRepository.find({
            where,
            order: { loggedAt: 'DESC' }
        }); // I guess this is how you do it I'm not exactly sure 

        return logs;
    }
}