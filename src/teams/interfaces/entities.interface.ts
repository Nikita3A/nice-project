import { UserEntity } from "src/users/models/user.entity";
import { TeamEntity } from "../models/team.entity";

export interface Entities {
    assignedTo: UserEntity;
    teamEntity: TeamEntity;
    userEntity: UserEntity;
}