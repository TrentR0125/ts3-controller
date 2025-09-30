import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
    @ApiProperty({ type: Number })
    @PrimaryGeneratedColumn({ type: 'integer' })
    userId: number;

    @ApiProperty({ type: String })
    @Column({ type: 'varchar' })
    name: string;

    @ApiProperty({ type: String })
    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', select: false })
    password: string;

    @ApiProperty({ type: String })
    @Column({ type: 'varchar', nullable: true })
    teamspeakId?: string;
}