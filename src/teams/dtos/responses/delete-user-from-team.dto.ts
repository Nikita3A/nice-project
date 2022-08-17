import { ApiProperty } from "@nestjs/swagger";

export class ResCreateTeamDTO {
    @ApiProperty()
    raw: [];
    affected: number;
}