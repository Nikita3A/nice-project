import { ApiProperty } from "@nestjs/swagger";

export class ResSignInDTO {
    @ApiProperty()
    access_token: string;
}