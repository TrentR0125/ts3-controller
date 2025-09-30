import { ApiProperty } from "@nestjs/swagger";
import { LogLevel } from "src/common/enums/log-level.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "events" })
export class Log {
    @ApiProperty({ type: Number })
    @PrimaryGeneratedColumn({ type: 'integer' })
    eventId: number;

    @ApiProperty({ type: String })
    @Column({ type: 'varchar' })
    source: string;

    @ApiProperty({ enum: LogLevel })
    @Column({ type: 'enum', enum: LogLevel })
    logLevel: LogLevel;

    @ApiProperty({ type: Date })
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    loggedAt: Date;

    @ApiProperty({ type: String })
    @Column({ type: 'longtext' })
    message: string;
}