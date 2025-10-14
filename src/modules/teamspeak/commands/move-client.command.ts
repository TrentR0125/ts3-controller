import { MoveClientDTO } from "../dtos/move-client.dto";

export class MoveClientCommand {
    constructor(public dto: MoveClientDTO) {}
}