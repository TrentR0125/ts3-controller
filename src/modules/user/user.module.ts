import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserService } from "./services/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserCommandHandlers } from "./commands/handlers";
import { UserQueryHandlers } from "./queries/handlers";
import { UserController } from "./controllers/user.controller";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UserController],
    providers: [
        UserService,
        ...UserCommandHandlers,
        ...UserQueryHandlers
    ],
    exports: [UserService]
})
export class UserModule {}