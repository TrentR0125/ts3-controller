import { LogLevel } from "../enums/log-level.enum";
import { CommandBus } from "@nestjs/cqrs";
import { AddLogCommand } from "src/modules/events/commands/add-log.command";

export class LogUtils {
    constructor(private commandBus: CommandBus) {}

    /**
     * Adds a log entry with the given source, level, and message.
     * 
     * - `source`: The origin of the log (e.g., "TeamSpeakService").
     * - `logLevel`: Severity of the log (INFO, ERROR, DEBUG, etc.).
     * - `message`: The content of the log.
     * - `addToDb` (default: true): Whether to also persist the log in the database.
     * 
     * Internally, this dispatches an AddLogCommand via the CQRS CommandBus.
     */
    async addLog(source: string, logLevel: LogLevel, message: string, addToDb: boolean = true) {
        // just to be clear this is probably one of the worst ways to do this but fuck it .. I'm open to suggestions
        await this.commandBus.execute(new AddLogCommand({ source, logLevel, loggedAt: new Date(), message }, addToDb)); 
    }
}