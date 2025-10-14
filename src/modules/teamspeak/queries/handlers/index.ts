import { GetChannelIdHandler } from "./get-channel-id.handler";
import { GetServerHandler } from "./get-server.handler";

export const TeamspeakQueryHandlers = [
    GetServerHandler,
    GetChannelIdHandler
];