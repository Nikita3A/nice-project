import { ApiProperty } from "@nestjs/swagger";

export class ResDeleteUsersDTO {
    @ApiProperty()
    raw: [];
    
    @ApiProperty()
    affected: number;
}
