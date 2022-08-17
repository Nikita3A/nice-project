import { ApiProperty } from "@nestjs/swagger";

export class ResDeleteFileFromStorageDTO {
    @ApiProperty()
    array: [];
    
    @ApiProperty()
    affected: number;
}