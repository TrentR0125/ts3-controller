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
}