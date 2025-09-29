import { Module } from "@nestjs/common";
import { TeamSpeakController } from "src/controllers/teamspeak/teamspeak.controller";
import { TeamSpeakService } from "src/services/teamspeak.service";

@Module({
    providers: [TeamSpeakService],
    controllers: [TeamSpeakController],
    exports: [TeamSpeakService]
})
export class TeamSpeakModule {}