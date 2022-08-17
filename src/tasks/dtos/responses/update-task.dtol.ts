import { ApiProperty } from "@nestjs/swagger";

export class ResUpdateTaskDTO {
    @ApiProperty()
    generatedMaps: [];

    @ApiProperty()
    raw: [];
    
    @ApiProperty()
    affected: number;
}