import { ApiProperty } from "@nestjs/swagger";

export class SignInDTO {
    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    password: string;
}