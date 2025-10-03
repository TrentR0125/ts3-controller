import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Server } from "./server.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "ts-config" })
export class TsConfig {
    @PrimaryColumn()
    @ApiProperty({ type: Number })
    serverId: number;

    @ApiProperty({ type: Number, nullable: true, default: null })
    @Column({ nullable: true, default: null })
    quickAfkChannelId: number;

    @ApiProperty({ type: Boolean, default: false })
    @Column({ default: false })
    antiVpnEnabled: boolean;

    @ApiProperty({ type: Server })
    @OneToOne(() => Server, s => s.serverId)
    @JoinColumn({ name: "serverId" })
    server: Server;
}