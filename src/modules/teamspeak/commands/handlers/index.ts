import { ChangeServerSettingsHandler } from "./change-server-settings.handler";
import { ConnectHandler } from "./connect.handler";
import { CreateServerHandler } from "./create-server.handler";
import { DeleteServerHandler } from "./delete-server.command";
import { KickByUniqueIdHandler } from "./kick-by-unique-id.handler";
import { MoveClientHandler } from "./move-client.handler";
import { UpdateServerHandler } from "./update-server.handler";

export const TeamspeakCommandHandlers = [
    ChangeServerSettingsHandler, 
    KickByUniqueIdHandler,
    UpdateServerHandler,
    DeleteServerHandler,
    CreateServerHandler,
    MoveClientHandler,
    ConnectHandler
];