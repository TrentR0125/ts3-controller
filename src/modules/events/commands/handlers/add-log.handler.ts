import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddLogCommand } from "../add-log.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "../../entities/log.entity";
import { Repository } from "typeorm";
import { BadRequestException, Logger } from "@nestjs/common";
import { LogLevel } from "src/common/enums/log-level.enum";
import { ConfigService } from "@nestjs/config";

import axios from "axios";

@CommandHandler(AddLogCommand)
export class AddLogHandler implements ICommandHandler<AddLogCommand> {
    private logger: Logger = new Logger("AddLogHandler");
    
    constructor(
        @InjectRepository(Log) private logRepository: Repository<Log>,
        private configService: ConfigService
    ) {}

    async execute(command: AddLogCommand) {
        const { dto, addToDb, usingDiscord } = command;

        if (!dto) {
            throw new BadRequestException();
        }

        const logMsg = `[${dto.loggedAt.toLocaleString()}] ${dto.message}`;

        switch (dto.logLevel) {
            case LogLevel.ERROR:
                this.logger.error(logMsg);
                break;

            case LogLevel.DEBUG:
                this.logger.debug(logMsg)
                break;

            case LogLevel.INFO:
                this.logger.log(logMsg);
                break;

            case LogLevel.WARN:
                this.logger.warn(logMsg);
                break;
        }

        const newLog: Log = { eventId: 0, source: dto.source, logLevel: dto.logLevel, loggedAt: dto.loggedAt, message: dto.message };
        
        if (addToDb) {
            const log = await this.logRepository.save(newLog);
            
            return log;
        }

        if (usingDiscord) {
            await this.sendDiscordLog(newLog).catch(err => this.logger.error("Failed to send Discord Log", err));
        }
    }

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