import { AddLogDTO } from "../dtos/add-log.dto";

export class AddLogCommand {
    constructor(public dto: AddLogDTO, public addToDb: boolean = false) {}
}