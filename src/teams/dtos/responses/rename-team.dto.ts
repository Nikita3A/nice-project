import { ApiProperty } from "@nestjs/swagger";

export class ResRenameTeamDTO {
    @ApiProperty()
    generatedMaps: [];

    @ApiProperty()
    raw: [];
    
    @ApiProperty()
    affected: number;
}