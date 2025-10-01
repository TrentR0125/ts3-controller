import { ApiProperty } from "@nestjs/swagger";

export class ChangeSettingsDTO {
    @ApiProperty({ type: String })
    virtualserverName: string;

    @ApiProperty({ type: String })
    virtualserverWelcomemessage: string;

    @ApiProperty({ type: String })
    virtualserverPassword: string;
}