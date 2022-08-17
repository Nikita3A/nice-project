import { ApiProperty } from "@nestjs/swagger";

export class ResGetFileDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    link: string;

    @ApiProperty()
    userid: number;
    
    @ApiProperty()
    name: string;
}