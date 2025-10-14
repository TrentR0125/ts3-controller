import { ApiProperty } from "@nestjs/swagger";

export class MoveClientDTO {
    @ApiProperty({ type: String, description: "The unique ID of the client to be moved" })
    uniqueId: string;

    @ApiProperty({ type: String, description: "The channel ID to move the client to" })
    channelId: string;

    @ApiProperty({ type: String, nullable: true, description: "The password to the channel if there is one" })
    channelPassword?: string;
}