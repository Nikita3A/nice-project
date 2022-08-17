import { ApiProperty } from "@nestjs/swagger";

export class ResDeleteTeamDTO {
    @ApiProperty()
    raw: [];
    
    @ApiProperty()
    affected: number;
}