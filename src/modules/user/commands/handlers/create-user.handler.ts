import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../create-user.command";
import { User } from "../../entities/user.entity";
import { BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddLogCommand } from "src/modules/events/commands/add-log.command";
import { LogLevel } from "src/common/enums";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private commandBus: CommandBus,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async execute(command: CreateUserCommand): Promise<User> {
        const dto = command.dto;

        if (!dto) {
            throw new BadRequestException();
        }

        const newUser = await this.userRepository.save({ userId: 0, ...dto });

        await this.commandBus.execute(new AddLogCommand({ source: "CreateUserHandler", logLevel: LogLevel.INFO, loggedAt: new Date(), message: `New User Created: (${newUser.userId}) ${newUser.name}` }, true));

        return newUser;
    }
}