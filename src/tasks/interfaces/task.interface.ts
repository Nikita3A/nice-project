import { TeamEntity } from "src/teams/models/team.entity";
import { UserEntity } from "src/users/models/user.entity";

export interface Task {
    id?: number,
    title: string,
    description: string,
    date?: Date,
    time: Date,
    status: Status;
    priority: Priority;
    created_by: UserEntity,
    assigned_to?: UserEntity,
    team: TeamEntity,
  }

export enum Status {
    DONE = 'done',
    DEVELOPING = 'developing',    
    PAUSED = 'paused'
}

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',    
    HIGH = 'high'
}
