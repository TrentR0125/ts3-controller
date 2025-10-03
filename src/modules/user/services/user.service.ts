import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
    
    async getUserById(userId: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ userId });
        if (!user)
            throw new NotFoundException('User not found');

        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user)
            throw new NotFoundException('User not found');
        
        return user;
    }
    
    async getUserByName(name: string): Promise<User[]> { // an array for possibility of users having the same name
        const users = await this.userRepository.find({ where: { name } });
        if (!users.length)
            throw new NotFoundException('User not found');

        return users;
    } 

    async getUserByTeamSpeakId(teamspeakId: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ teamspeakId });
        if (!user)
            throw new NotFoundException('User not found');

        return user;
    }
}