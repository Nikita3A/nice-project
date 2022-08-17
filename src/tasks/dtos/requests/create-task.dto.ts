import { ApiProperty } from "@nestjs/swagger";
import { Priority, Status } from "../../../tasks/interfaces/task.interface";

export class ReqCreateTaskDTO {
    @ApiProperty()
    title: string;
    
    @ApiProperty()
    description?: string;
    
    @ApiProperty()
    date: Date;
    
    @ApiProperty({nullable: true})
    time?: Date;

    @ApiProperty({ enum: Object.values(Status) })
    status: Status;

    @ApiProperty({ enum: Object.values(Priority) })
    priority: Priority;

    @ApiProperty()
    assignedTo?: string;
}