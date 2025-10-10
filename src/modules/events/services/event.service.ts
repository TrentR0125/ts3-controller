import { Injectable, Logger } from "@nestjs/common";
import { Subject } from "rxjs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LogLevel } from "src/common/enums";
import { Event } from "../entities/event.entity";

@Injectable()
export class EventService {
    private logger = new Logger('EventService');
    private usingDiscord = false; // for now I need to put this here until I have a way of setting a log channel in discord...
    
    private clientEvents$ = new Subject<{ userId: number; level: LogLevel, message: string }>();
    private roomEvents$ = new Subject<{ room: string; level: LogLevel; message: string }>();

    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>
    ) { }

    getClientEvents() {
        return this.clientEvents$.asObservable();
    }

    getRoomEvents() {
        return this.roomEvents$.asObservable();
    }

    async info(message: string, source = 'Service', userId?: number, room?: string) {
        return this.log(LogLevel.INFO, message, source, userId, room);
    }

    async warn(message: string, source = 'Service', userId?: number, room?: string) {
        return this.log(LogLevel.WARN, message, source, userId, room);
    }

    async error(message: string, source = 'Service', userId?: number, room?: string) {
        return this.log(LogLevel.ERROR, message, source, userId, room);
    }

    async debug(message: string, source = 'Service', userId?: number, room?: string) {
        return this.log(LogLevel.DEBUG, message, source, userId, room);
    }

    private async log(level: LogLevel, message: string, source: string, userId?: number, room?: string) {
        const event = await this.eventRepository.save({
            source,
            logLevel: level,
            loggedAt: new Date(),
            message
        });

        if (userId) this.clientEvents$.next({ userId, level, message });
        if (room) this.roomEvents$.next({ room, level, message });

        switch (level) {
            case LogLevel.INFO: this.logger.log(message, source); break;
            case LogLevel.WARN: this.logger.warn(message, source); break;
            case LogLevel.ERROR: 
                this.logger.error(message, this, source); // not sure if 'this' will work but we will find out .. later
                this.usingDiscord ? this.sendToDiscord(message, source, event.loggedAt) : '';
            break;
            case LogLevel.DEBUG: this.logger.debug(message, source); break;
            default: this.logger.log(message, source); break;
        }
    }

    private async sendToDiscord(message: string, source: string, timestamp: Date) {
        try {
            
        } catch (err) {

        }
    }
}