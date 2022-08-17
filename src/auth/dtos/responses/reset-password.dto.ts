import { ApiProperty } from "@nestjs/swagger";

export class ResResetPasswordDTO {
    @ApiProperty()
    generatedMaps: [];

    @ApiProperty()
    raw: [];
    
    @ApiProperty()
    affected: number;
}