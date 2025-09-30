import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamSpeakController } from "src/modules/teamspeak/controllers/teamspeak.controller";
import { TeamSpeakService } from "src/modules/teamspeak/services/teamspeak.service";
import { Server } from "./entities/server.entity";
import { TeamSpeakGateway } from "./gateways/teamspeak.gateway";

@Module({
    imports: [
        TypeOrmModule.forFeature([Server])
    ],
    providers: [TeamSpeakService, TeamSpeakGateway],
    controllers: [TeamSpeakController]
})
export class TeamSpeakModule {}