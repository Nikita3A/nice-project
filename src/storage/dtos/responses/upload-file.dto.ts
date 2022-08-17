import { ApiProperty } from "@nestjs/swagger";

class UserIdRelation {
    @ApiProperty()
    id: number;
}

export class ResUploadFileDTO {
    @ApiProperty()
    user: UserIdRelation;

    @ApiProperty()
    name: string;

    @ApiProperty()
    link: string;
    
    @ApiProperty()
    id: number;
}