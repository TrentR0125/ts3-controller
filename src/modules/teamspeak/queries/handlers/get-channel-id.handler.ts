import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetChannelIdQuery } from "../get-channel-id.query";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { tsClient } from "src/common/classes";

@QueryHandler(GetChannelIdQuery)
export class GetChannelIdHandler implements IQueryHandler<GetChannelIdQuery> {
    async execute(query: GetChannelIdQuery): Promise<string> {
        const channelName = query.channelName;

        if (!channelName) {
            throw new BadRequestException();
        }

        const channel = await tsClient.getChannelByName(channelName);

        if (!channel) {
            throw new NotFoundException("Channel not found");
        }

        return channel.cid;
    }
}