import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Log } from "./entities/log.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { EventsQueryHandlers } from "./queries/handlers";
import { EventsCommandHandlers } from "./commands/handlers";
import { LogService } from "./services/log.service";
import { EventController } from "./controllers/event.controller";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Log])
    ],
    controllers: [EventController],
    providers: [
        LogService,
        ...EventsQueryHandlers,
        ...EventsCommandHandlers
    ]
})
export class EventsModule {}