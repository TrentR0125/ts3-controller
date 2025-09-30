import { ApiProperty } from "@nestjs/swagger";
import { LogLevel } from "src/common/enums/log-level.enum";

export class AddLogDTO {
    @ApiProperty({ type: String })
    source: string;
    
    @ApiProperty({ enum: LogLevel })
    logLevel: LogLevel;
    
    @ApiProperty({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
    loggedAt: Date;
    
    @ApiProperty({ type: String })
    message: string;
}