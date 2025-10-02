import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { KickByUniqueIdCommand } from "../kick-by-unique-id.command";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { GetUserQuery } from "src/modules/user/queries/get-user.query";
import { tsClient } from "src/common/classes";
import { ReasonIdentifier, TeamSpeakClient } from "ts3-nodejs-library";
import { User } from "src/modules/user/entities/user.entity";
import { AddLogCommand } from "src/modules/events/commands/add-log.command";
import { LogLevel } from "src/common/enums";

@CommandHandler(KickByUniqueIdCommand)
export class KickByUniqueIdHandler implements ICommandHandler<KickByUniqueIdCommand> {
    constructor(
        private queryBus: QueryBus,
        private commandBus: CommandBus
    ) {}

    async execute(command: KickByUniqueIdCommand): Promise<void> {
        const { uniqueId, reason, serverKick } = command;

        if (!uniqueId) {
            throw new BadRequestException();
        }

        const user = await this.queryBus.execute(new GetUserQuery(uniqueId)) as User;

        if (user) {
            const userCl = await tsClient.getClientByUid(uniqueId);

            if (userCl) {
                await tsClient.clientKick(userCl, serverKick ? ReasonIdentifier.KICK_SERVER : ReasonIdentifier.KICK_CHANNEL, reason || "No Reason Provided.");
                await this.commandBus.execute(new AddLogCommand({ source: "KickByUniqueIdHandler", logLevel: LogLevel.WARN, loggedAt: new Date(), message: `(${user.userId}) ${user.name} was kicked from ${serverKick ? "the server" : "a channel"}.` }, true));
            }

            await this.commandBus.execute(new AddLogCommand({ source: "KickByUniqueIdHandler", logLevel: LogLevel.WARN, loggedAt: new Date(), message: `(${user.userId}) ${user.name} had a kick attempt upon them, they werent in server.` }, true));

            throw new NotFoundException(`(${user.userId}) ${user.name} is not in the server.`);
        }

        throw new NotFoundException(`Could not find a user with the unique ID of ${uniqueId}`);
    }
}