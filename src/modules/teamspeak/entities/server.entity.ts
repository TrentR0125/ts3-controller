import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TsConfig } from "./ts-config.entity";

@Entity({ name: "server" })
export class Server {
    @ApiProperty({ type: Number })
    @PrimaryGeneratedColumn({ type: 'integer' })
    serverId: number;

    @ApiProperty({ type: String })
    @Column({ type: 'varchar' })
    serverIp: string;

    @ApiProperty({ type: Number })
    @Column({ type: 'integer' })
    serverPort: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'integer' })
    queryPort: number;

    @ApiProperty({ type: String })
    @Column({ type: 'varchar' })
    queryName: string;

    @ApiProperty({ type: String })
    @Column({ type: 'varchar' })
    queryPassword: string;

    @ApiProperty({ type: Date })
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @ApiProperty({ type: Date, nullable: true })
    @Column({ type: 'datetime', nullable: true })
    deletedAt?: Date;

    @ApiProperty({ type: Boolean, default: false })
    @Column({ type: 'boolean', default: false })
    isDeleted?: boolean;

    @ApiProperty({ type: Boolean, default: false })
    @Column({ type: 'boolean', default: false })
    usePelicanOrPtero?: boolean; // we have this here for pelican/pterodactyl integration

    @ApiProperty({ type: String, nullable: true })
    @Column({ type: 'varchar', nullable: true, default: null })
    containerId?: string; // we put null here due to "usePelicanOrPtero" being optional

    @ApiProperty({ type: Boolean, default: false })
    usingDiscordLogging?: boolean; // should we put this in configService?

    @ApiProperty({ type: String, default: null, nullable: true })
    @Column({ type: 'varchar', nullable: true, default: null })
    discordChannelWebhook?: string;
    
    @ApiProperty({ type: TsConfig })
    @OneToOne(() => TsConfig, ts => ts.server, { eager: true })
    tsConfig?: TsConfig;
}