import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Log")
@Controller('log')
export class LogController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus
    ) {}

    
}