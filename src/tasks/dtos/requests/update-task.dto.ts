import { ApiProperty } from "@nestjs/swagger";
import { Priority, Status } from "src/tasks/interfaces/task.interface";

export class ReqUpdateTaskDTO {
    @ApiProperty()
    title?: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    time?: Date;    

    @ApiProperty()
    assignedTo?: string;

    @ApiProperty({ enum: Object.values(Status) })
    status?: Status;
    
    @ApiProperty({ enum: Object.values(Priority) })
    priority?: Priority;
}