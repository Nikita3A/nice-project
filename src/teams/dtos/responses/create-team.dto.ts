import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../../users/interfaces/user.interface";

class User{
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ enum: ['Admin', 'User']})
    role: UserRole;
}

export class ResCreateTeamDTO {
    @ApiProperty()
    name: string;

    @ApiProperty()
    emailOfCreator: string;

    @ApiProperty({ type: User })
    createdBy: User;

    @ApiProperty()
    numberOfCompletedTasks: number;

    @ApiProperty()
    numberOfCurrentTasks: number;

    @ApiProperty()
    numberOfTasks: number;

    @ApiProperty()
    numberOfMembers: number;
    
    @ApiProperty()
    id: number;
}