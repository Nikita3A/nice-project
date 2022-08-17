import { UserEntity } from 'src/users/models/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TeamEntity } from './team.entity';
import { UserRoleInTeam } from '../interfaces/team.interface';

@Entity()
export class TeamsUsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.id, {onDelete:'CASCADE'})
    user: UserEntity;

    @ManyToOne(() => TeamEntity, (team) => team.id, {onDelete:'CASCADE'})
    team: TeamEntity;

    @Column({type: 'enum', enum: UserRoleInTeam, default: UserRoleInTeam.USER})
    role: UserRoleInTeam;
}