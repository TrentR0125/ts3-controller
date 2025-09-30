import { LogLevel } from "src/common/enums/log-level.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Log {
    @PrimaryGeneratedColumn({ type: 'integer' })
    eventId: number;

    @Column({ type: 'varchar' })
    source: string;

    @Column({ type: 'enum', enum: LogLevel })
    logLevel: LogLevel;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    loggedAt: Date;

    @Column({ type: 'longtext' })
    message: string;
}