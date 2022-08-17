import { ApiProperty } from "@nestjs/swagger";

export class ResLogoutDTO {
    @ApiProperty()
    token: string;
    
    @ApiProperty()
    id: number;
}