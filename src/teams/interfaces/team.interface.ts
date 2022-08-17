import { User } from "src/users/interfaces/user.interface";
import { UserEntity } from "src/users/models/user.entity";
import { TeamEntity } from "../models/team.entity";

export interface Team {
    id?: number;
    name: string;
    emailOfCreator: string;
    numberOfTasks?: number;
    numberOfCurrentTasks?: number;
    numberOfCompletedTasks?: number;
    numberOfMembers?: number;
    createdBy: UserEntity;
}

export interface TeamsUsers {
    id?: number;
    user: User;
    team: TeamEntity;
    role?: UserRoleInTeam;
}

export enum UserRoleInTeam {
    ADMIN = 'admin',
    DEVELOPER = 'developer',    
    QA = 'qa',
    USER = 'user',
    CLIENT = 'client',
    MANAGER = 'manager',
}