import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { RequireAuth } from "src/decorators/require-auth.decorator";
import { GetAllLogsQuery } from "../queries/get-all-logs.query";
import { Log } from "../entities/log.entity";
import { SearchLogsDTO } from "../dtos/search-logs.dto";
import { SearchLogsQuery } from "../queries/search-logs.query";
import { GetLogByIdQuery } from "../queries/get-log-by-id.query";
import { LogLevel } from "src/common/enums";
import { GetLogsByLevelQuery } from "../queries/get-logs-by-level.query";
import { AddLogDTO } from "../dtos/add-log.dto";
import { AddLogCommand } from "../commands/add-log.command";

@ApiTags("Log")
@Controller('log')
export class EventController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus
    ) {}

    @Post("search")
    @RequireAuth(true)
    @ApiOkResponse({ type: [Log] })
    async searchLogs(@Body() dto: SearchLogsDTO): Promise<Log[]> {
        return await this.queryBus.execute(new SearchLogsQuery(dto));
    }

    @Post("log/:addToDb/:usingDiscord")
    @RequireAuth(true)
    @ApiOkResponse({ type: Log })
    async addLog(@Body() dto: AddLogDTO, @Param("addToDb") addToDb: boolean, @Param("usingDiscord") usingDiscord: boolean): Promise<Log | void> {
        return await this.commandBus.execute(new AddLogCommand(dto, addToDb, usingDiscord));
    }

    @Get("logs")
    @RequireAuth(true)
    @ApiOkResponse({ type: [Log] })
    async getLogs(): Promise<Log[]> {
        return await this.queryBus.execute(new GetAllLogsQuery());
    }

    @Get("logs/:logLevel")
    @RequireAuth(true)
    @ApiOkResponse({ type: [Log] })
    async getLogByLevel(@Param("logLevel") logLevel: LogLevel): Promise<Log[]> {
        return await this.queryBus.execute(new GetLogsByLevelQuery(logLevel));
    }

    @Get("log/:eventId")
    @RequireAuth(true)
    @ApiOkResponse({ type: Log })
    async getLogById(@Param("eventId") eventId: number): Promise<Log> {
        return await this.queryBus.execute(new GetLogByIdQuery(eventId));
    }
}