import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Server {
    @PrimaryGeneratedColumn({ type: 'integer' })
    serverId: number;

    @Column({ type: 'varchar' })
    serverIp: string;

    @Column({ type: 'integer' })
    serverPort: number;

    @Column({ type: 'integer' })
    queryPort: number;

    @Column({ type: 'varchar' })
    queryName: string;

    @Column({ type: 'varchar' })
    queryPassword: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'datetime', nullable: true })
    deletedAt?: boolean;

    @Column({ type: 'datetime', default: false })
    isDeleted: boolean;

    @Column({ type: 'boolean', default: false })
    fivemWhitelistEnabled: boolean;
}