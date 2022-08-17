import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from '../interfaces/user.interface';
import { TeamEntity } from 'src/teams/models/team.entity';
import { TeamsUsersEntity } from 'src/teams/models/team_user.entity';
import { TaskEntity } from 'src/tasks/models/task.entity';
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
  role: UserRole;

  @Column({ type: 'date' })
  created_on: string;

  @Column({ type: 'date' })
  last_login: string;

  @Column()
  isEmailVerified: boolean;

  @OneToMany(() => TeamEntity, team => team.id, { onDelete: 'CASCADE' })
  team: TeamEntity[];

  @OneToMany(() => TaskEntity, task => task.createdBy)
  createdTasks: TaskEntity[];

  @OneToMany(() => TaskEntity, task => task.assignedTo, {onUpdate: 'CASCADE'})
  assignedTasks: TaskEntity[];

  @OneToMany(() => TeamsUsersEntity, (teamUsers) => teamUsers.user, {onUpdate: 'CASCADE'})
  teamUsers: TeamsUsersEntity[];
}