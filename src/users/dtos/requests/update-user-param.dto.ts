import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserQueryDTO {
    @ApiProperty()
    id: number;
}