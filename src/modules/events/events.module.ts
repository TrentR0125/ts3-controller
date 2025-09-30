import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Log } from "./entities/log.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { EventsQueryHandlers } from "./queries/handlers";
import { EventsCommandHandlers } from "./commands/handlers";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Log])
    ],
    controllers: [],
    providers: [
        ...EventsQueryHandlers,
        ...EventsCommandHandlers
    ]
})
export class EventsModule {}