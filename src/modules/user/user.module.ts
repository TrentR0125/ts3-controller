import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserService } from "./services/user.service";

@Module({
    imports: [CqrsModule],
    controllers: [],
    providers: [UserService]
})
export class UserModule {}