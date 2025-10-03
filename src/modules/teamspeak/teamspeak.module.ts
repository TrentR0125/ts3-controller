import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamSpeakController } from "src/modules/teamspeak/controllers/teamspeak.controller";
import { TeamSpeakService } from "src/modules/teamspeak/services/teamspeak.service";
import { Server } from "./entities/server.entity";
import { TeamSpeakGateway } from "./gateways/teamspeak.gateway";
import { CqrsModule } from "@nestjs/cqrs";
import { TeamspeakCommandHandlers } from "./commands/handlers";
import { TeamspeakQueryHandlers } from "./queries/handlers";
import { TsConfig } from "./entities/ts-config.entity";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Server, TsConfig])
    ],
    providers: [
        TeamSpeakService,
        TeamSpeakGateway,
        ...TeamspeakCommandHandlers,
        ...TeamspeakQueryHandlers
    ],
    controllers: [TeamSpeakController]
})
export class TeamSpeakModule {}