import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsOptional, MaxLength, MinLength, ValidateIf } from "class-validator";

export class ReqUpdateUserDTO {
    @ApiProperty({required: false})
    @ValidateIf(o => o.name !== '')
    @MinLength(3)
    @MaxLength(20)
    @IsOptional()
    name: string;

    @ApiProperty({ type: 'file', required: false })
    @IsEmpty()    
    @IsOptional()
    avatar: any;
}
