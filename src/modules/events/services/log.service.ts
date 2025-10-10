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
        private logRepository: Repository<Log>,
        private configService: ConfigService
    ) { }

    private logger = new Logger('LogService');

    /**
     * Finds a single log by its ID.
     * @param logId - The ID of the log to find.
     * @throws NotFoundException if the log does not exist.
     */
    async findLogById(logId: number): Promise<Log> {
        const log = await this.logRepository.findOneBy({ eventId: logId });
        if (!log)
            throw new NotFoundException('Log not found');

        return log;
    }

    /**
     * Retrieves all logs in the database.
     * @throws NotFoundException if no logs are found.
     */
    async getLogs(): Promise<Log[]> {
        const logs = await this.logRepository.find();
        if (!logs?.length)
            throw new NotFoundException('Logs not found');

        return logs;
    }

    /**
     * Retrieves logs by their level.
     * @param logLevel - The level of logs to retrieve.
     */
    async getLogsByLevel(logLevel: LogLevel): Promise<Log[]> {
        return this.getLogsByField('logLevel', logLevel);
    }

    /**
     * Inserts a new log entry into the database.
     * @param dto - The DTO containing log details.
     */
    async addLog(dto: AddLogDTO, usingDiscord: boolean = false) {
        const log = await this.logRepository.save({
            source: dto.source,
            logLevel: dto.logLevel,
            message: dto.message,
            loggedAt: new Date()
        });

        switch (dto.logLevel) {
            case LogLevel.DEBUG: this.logger.debug(dto.message); break;
            case LogLevel.INFO: this.logger.log(dto.message); break;
            case LogLevel.WARN: this.logger.warn(dto.message); break;
            case LogLevel.ERROR: this.logger.error(dto.message); break;
        }

        if (usingDiscord)
            this.sendDiscordLog(log).catch(err => this.logger.error('Failed to send log to Discord', err));

        return log;
    }

    /**
     * Searches logs with optional filters and pagination.
     * Supports filtering by date range, log level/type, source, serverId, and message search.
     */
    async searchLogs(dto: SearchLogsDTO): Promise<Log[]> {
        if (!dto.from || !dto.to)
            throw new BadRequestException('Start date and end date are required');

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

    /**
     * Generic method to retrieve logs by a given field and value.
     * @param field - The column name to filter by (e.g., 'logType', 'logLevel').
     * @param value - The value to match in that column.
     * @throws NotFoundException if no logs match the filter.
     */
    private async getLogsByField<K extends keyof Log>(field: K, value: Log[K]): Promise<Log[]> {
        const logs = await this.logRepository.find({ where: { [field]: value } });
        if (!logs?.length)
            throw new NotFoundException('Logs not found');

        return logs;
    }

    /**
     * Sends a log to Discord with dynamic color and title based on log level.
     * @param log - The saved log entity
     */
    private async sendDiscordLog(log: Log) {
        const colorMap: Record<LogLevel, number> = {
            [LogLevel.INFO]: 0x2EECC71, // green
            [LogLevel.WARN]: 0xF1C40F, // yellow
            [LogLevel.ERROR]: 0xE74C3C, // red 
            [LogLevel.DEBUG]: 0x3498DB // blue
        };

        const titleMap: Record<LogLevel, string> = {
            [LogLevel.INFO]: 'Info',
            [LogLevel.WARN]: 'Warning',
            [LogLevel.ERROR]: `An Error has occured! Log ID: ${log.eventId}`,
            [LogLevel.DEBUG]: 'Debug',
        };

        const embed = {
            title: titleMap[log.logLevel] || 'Log',
            color: colorMap[log.logLevel] || 0x95A5A6, // default gray
            fields: [
                { name: 'Source', value: log.source },
                { name: 'Message', value: `\`\`\`${log.message || 'No Message'}\`\`\`` },
            ],
            footer: { text: `${log.loggedAt?.toLocaleDateString()} ${log.loggedAt?.toLocaleTimeString()}` }
        };

        const isError = log.logLevel === LogLevel.ERROR;

        const role = this.configService.get<string>('DISCORD_API_ROLE');
        const channelId = this.configService.get<string>('DISCORD_API_LOGS_CHANNEL_ID');
        const webhook = this.configService.get<string>('DISCORD_API_LOGS_WEBHOOK');

        if (!channelId || !webhook) return;

        const webhookUrl = `https://discord.com/api/webhooks/${channelId}/${webhook}`

        await axios.post(webhookUrl, {
            content: isError ? `<@${role}>` : '',
            embeds: [embed]
        });
    }
}