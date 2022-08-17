import { ApiProperty } from "@nestjs/swagger";
import { Priority, Status } from "../../../tasks/interfaces/task.interface";

export class ResGetTasksDTO {
    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    time: Date;

    @ApiProperty({ enum: Object.values(Status) })
    status: Status;
    
    @ApiProperty({ enum: Object.values(Priority) })
    priority: Priority;
}