import { CreateUserDTO } from "../dtos/create-user.dto";

export class CreateUserCommand {
    constructor(public token: string, public dto: CreateUserDTO) {}
}