import { EditServerDTO } from "../dtos/edit-server.dto";

export class UpdateServerCommand {
    constructor(
        public serverId: number,
        public dto: EditServerDTO
    ) {}
}