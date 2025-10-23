import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Between, ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LogLevel } from "src/common/enums";
import { Log } from "../entities/log.entity";
import { ConfigService } from "@nestjs/config";
import { AddLogDTO } from "../dtos/add-log.dto";
import { SearchLogsDTO } from "../dtos/search-logs.dto";
import axios from "axios";

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private logRepository: Repository<Log>
    ) { }

    /**
     * Generic method to retrieve logs by a given field and value.
     * @param field - The column name to filter by (e.g., 'logType', 'logLevel').
     * @param value - The value to match in that column.
     * @throws NotFoundException if no logs match the filter.
     */
    async getLogsByField<K extends keyof Log>(field: K, value: Log[K]): Promise<Log[]> {
        const logs = await this.logRepository.find({ where: { [field]: value } });

        if (!logs?.length) {
            throw new NotFoundException('Logs not found');
        }

        return logs;
    }
}