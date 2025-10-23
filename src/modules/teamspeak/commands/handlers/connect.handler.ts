import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ConnectCommand } from "../connect.command";

@CommandHandler(ConnectCommand)
export class ConnectHandler implements ICommandHandler<ConnectCommand> {
    constructor() {}

    async execute(command: ConnectCommand): Promise<void> {
        
    }
}