import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddLogCommand } from "../add-log.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "../../entities/event.entity";
import { Repository } from "typeorm";
import { BadRequestException, Logger } from "@nestjs/common";
import { LogLevel } from "src/common/enums/log-level.enum";

@CommandHandler(AddLogCommand)
export class AddLogHandler implements ICommandHandler<AddLogCommand> {
    private logger: Logger = new Logger("AddLogHandler");
    
    constructor(
        @InjectRepository(Log) private logRepository: Repository<Log>
    ) {}

    async execute(command: AddLogCommand) {
        const { dto, addToDb } = command;

        if (!dto) {
            throw new BadRequestException();
        }

        const newLog: Log = { eventId: 0, source: dto.source, logLevel: dto.logLevel, loggedAt: dto.loggedAt, message: dto.message };
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

        if (addToDb) {
            const log = await this.logRepository.save(newLog);
            
            return log;
        }
    }
}