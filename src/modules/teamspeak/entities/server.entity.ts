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
    createdAt: Date;

    @ApiProperty({ type: Date, nullable: true })
    @Column({ type: 'datetime', nullable: true })
    deletedAt?: Date;

    @ApiProperty({ type: Boolean, default: false })
    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @ApiProperty({ type: Boolean, default: false })
    @Column({ type: 'boolean', default: false })
    fivemWhitelistEnabled: boolean;

    @ApiProperty({ type: TsConfig })
    @OneToOne(() => TsConfig, ts => ts.server, { eager: true })
    tsConfig: TsConfig;
}