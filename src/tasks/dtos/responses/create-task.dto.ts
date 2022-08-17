import { ApiProperty } from "@nestjs/swagger";
import { Priority, Status } from "../../../tasks/interfaces/task.interface";
import { UserRoleInTeam } from "../../../teams/interfaces/team.interface";

class Team {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    emailOfCreator: string;

    @ApiProperty()
    numberOfTasks: number;

    @ApiProperty()
    numberOfCurrentTasks: number;

    @ApiProperty()
    numberOfCompletedTasks: number;

    @ApiProperty()
    numberOfMembers: number;
}

class AssignedTo {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ enum: Object.values(UserRoleInTeam) })
    role: UserRoleInTeam;

    @ApiProperty()
    created_on: Date;

    @ApiProperty()
    last_login: Date;

    @ApiProperty()
    isEmailVerified: boolean;
}

class CreatedBy {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ enum: Object.values(UserRoleInTeam) })
    role: UserRoleInTeam;
}

export class ResCreateTaskDTO {
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

    @ApiProperty()
    createdBy: CreatedBy;

    @ApiProperty()
    assignedTo: AssignedTo;

    @ApiProperty()
    team: Team;

    @ApiProperty()
    id: number;
}