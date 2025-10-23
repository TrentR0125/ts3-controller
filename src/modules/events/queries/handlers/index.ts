import { GetAllLogsHandler } from "./get-all-logs.handler";
import { GetLogByIdHandler } from "./get-log-by-id.handler";
import { GetLogsByLevelHandler } from "./get-logs-by-level.handler";
import { SearchLogsHandler } from "./search-logs.handler";

export const EventsQueryHandlers = [
    GetAllLogsHandler,
    GetLogsByLevelHandler,
    GetLogByIdHandler,
    SearchLogsHandler
];