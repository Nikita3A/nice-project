import { ApiProperty } from "@nestjs/swagger";

class UpdatedUser {
    @ApiProperty()
    generatedMaps: [];

    @ApiProperty()
    raw: [];

    @ApiProperty()
    affected: number;
}
class UpdatedAvatar {
    @ApiProperty()
    id: number;
}
export class ResUpdateUserDTO {
    @ApiProperty()
    updatedUser: UpdatedUser;

    @ApiProperty()
    updatedAvatar: UpdatedAvatar;

    @ApiProperty()
    name: string;

    @ApiProperty()
    link: string;
    
    @ApiProperty()
    id: number;
}
