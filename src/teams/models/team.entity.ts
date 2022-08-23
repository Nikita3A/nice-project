import { TaskEntity } from 'src/tasks/models/task.entity';
import { UserEntity } from 'src/users/models/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { TeamsUsersEntity } from './team_user.entity';

@Entity()
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  created_by: UserEntity;

  @OneToMany(() => TeamsUsersEntity, (teamUsers) => teamUsers.team)
  members: TeamsUsersEntity[];

  @OneToMany(() => TaskEntity, task => task.team, {onUpdate: 'CASCADE'})
  tasks: TaskEntity[];
}