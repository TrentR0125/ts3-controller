import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
    @ApiProperty({ type: String })
    name: string;
    
    @ApiProperty({ type: String })
    email: string;
    
    @ApiProperty({ type: String })
    password: string;
    
    @ApiProperty({ type: String })
    teamspeakId?: string;
}