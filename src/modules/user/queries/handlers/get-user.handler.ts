import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserQuery } from "../get-user.query";
import { User } from "../../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadRequestException, NotFoundException } from "@nestjs/common";

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async execute(query: GetUserQuery): Promise<User | User[]> {
        const param = query.userParam;

        if (!param) {
            throw new BadRequestException();
        }

        const where: any[] = [];

        if (!isNaN(Number(param))) {
            where.push({ userId: Number(param) });
        }

        where.push({ email: String(param) });
        where.push({ name: String(param) });
        where.push({ teamspeakId: String(param) });

        const user = await this.userRepository.find({ where });

        if (!user || user.length == 0) {
            throw new NotFoundException();
        }

        return user.length == 1 ? user[0] : user;
    }
}