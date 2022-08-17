import { ApiProperty } from "@nestjs/swagger";

export class ResGetTeamDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    createdbyid: number;
    
    @ApiProperty()
    numberOfMembers: number;
}