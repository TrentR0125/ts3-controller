import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MoveClientCommand } from "../move-client.command";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { tsClient } from "src/common/classes";
import { AddLogCommand } from "src/modules/events/commands/add-log.command";
import { LogLevel } from "src/common/enums";

@CommandHandler(MoveClientCommand)
export class MoveClientHandler implements ICommandHandler<MoveClientCommand> {
    async execute(command: MoveClientCommand): Promise<void> {
        const dto = command.dto;

        if (!dto) {
            throw new BadRequestException();
        }

        const client = await tsClient.getClientByUid(dto.uniqueId);
        const channel = await tsClient.getChannelById(dto.channelId);

        if (!client || !channel) {
            throw new NotFoundException("Channel or client could not be found");
        }

        await tsClient.clientMove(client, channel, (await channel.getInfo()).channelPassword != null ? dto.channelPassword : "");
    }
}