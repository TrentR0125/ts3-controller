import { LogLevel } from "src/common/enums/log-level.enum";

export class GetLogsByLevelQuery {
    constructor(
        public level: LogLevel
    ) {}
} 