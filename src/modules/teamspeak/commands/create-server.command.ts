import { CreateServerDTO } from "../dtos/create-server.dto";

export class CreateServerCommand {
    constructor(public dto: CreateServerDTO) {}
}