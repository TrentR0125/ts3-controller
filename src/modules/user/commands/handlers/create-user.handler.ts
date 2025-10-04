import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../create-user.command";
import { User } from "../../entities/user.entity";
import { BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddLogCommand } from "src/modules/events/commands/add-log.command";
import { LogLevel } from "src/common/enums";
import { GetUserFromTokenQuery } from "src/modules/auth/queries/get-user-from-token.query";
import { hash } from "src/common/utils";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async execute(command: CreateUserCommand): Promise<User> {
        const { token, dto } = command;

        if (!dto) {
            throw new BadRequestException();
        }

        dto.password = (await hash(dto.password)).toString();

        const newUser = await this.userRepository.save({ userId: 0, ...dto });
        const creator = await this.queryBus.execute(new GetUserFromTokenQuery(token)) as User;

        await this.commandBus.execute(new AddLogCommand(
            { 
                source: "CreateUserHandler", 
                logLevel: LogLevel.INFO, 
                loggedAt: new Date(), 
                message: `New User Created: (${newUser.userId}) ${newUser.name} | Created by: (${creator.userId}) ${creator.name}` 
            }, true)
        );

        return newUser;
    }
}