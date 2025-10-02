import { ApiProperty } from "@nestjs/swagger";

export class KickByUniqueIdDTO {
    @ApiProperty({ type: String })
    uniqueId: string;

    @ApiProperty({ type: String })
    reason: string;

    @ApiProperty({ type: Boolean })
    serverKick: boolean;
}