import { ApiProperty } from "@nestjs/swagger";
import { LogLevel } from "src/common/enums/log-level.enum";

export class SearchLogsDTO {
    @ApiProperty({ description: 'The source of the log event', required: false })
    source?: string;

    @ApiProperty({ description: 'The log level of the event', enum: LogLevel, required: false })
    logLevel?: LogLevel;

    @ApiProperty({ description: 'The start date for the search', type: Date, required: true })
    from: Date;

    @ApiProperty({ description: 'The end date for the search', type: Date, required: true })
    to: Date;

    @ApiProperty({ description: 'A string to search for in the log messages', required: false })
    contains?: string;
}