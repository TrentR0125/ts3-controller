import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor() {}

    // i removed getUserById, getUserByEmail, getUserByName, and getUserByTeamspeakId because the GetUserQuery handles all of that
}