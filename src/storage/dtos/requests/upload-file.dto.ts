import { ApiProperty } from "@nestjs/swagger";

export class ReqUploadFileDTO {
    @ApiProperty({ type: 'file'})
    avatar: any;
}