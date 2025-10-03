import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Server } from "./server.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "ts-config" })
export class TsConfig {
    @PrimaryColumn()
    @ApiProperty({ type: Number })
    serverId: number;

    @ApiProperty({ type: Server })
    @OneToOne(() => Server, s => s.serverId)
    @JoinColumn({ name: "serverId" })
    server: Server;
}