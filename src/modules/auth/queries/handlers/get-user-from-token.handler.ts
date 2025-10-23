import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetUserFromTokenQuery } from "../get-user-from-token.query";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/modules/user/entities/user.entity";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { GetUserQuery } from "src/modules/user/queries/get-user.query";

@QueryHandler(GetUserFromTokenQuery)
export class GetUserFromTokenHandler implements IQueryHandler<GetUserFromTokenQuery> {
    constructor(
        private queryBus: QueryBus,
        private jwtService: JwtService
    ) {}

    async execute(query: GetUserFromTokenQuery): Promise<User> {
        const token = query.token;

        if (!token) {
            throw new UnauthorizedException("No token");
        }

        let payload: any;

        try {
            payload = this.jwtService.verify(token);
        } catch {
            //
        }

        const user = await this.queryBus.execute(new GetUserQuery(payload.userId)) as User;

        if (!user) {
            throw new NotFoundException("Could not find user attached to token");
        }

        return user;
    }
}