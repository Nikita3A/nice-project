import { TeamEntity } from 'src/teams/models/team.entity';
import { UserEntity } from 'src/users/models/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Priority, Status } from '../interfaces/task.interface';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;
  
  @Column()
  description?: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({nullable: true})
  time: Date;
  
  @Column('enum', {enum: Status, default: Status[Status.DEVELOPING]})
  status: Status;
  
  @Column('enum', {enum: Priority, default: Priority[Priority.MEDIUM]})
  priority: Priority;

  @ManyToOne(() => UserEntity, user => user.createdTasks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  createdBy: UserEntity;
  
  @ManyToOne(() => UserEntity, user => user.assignedTasks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  assignedTo?: UserEntity;

  @ManyToOne(() => TeamEntity, team => team.tasks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  team: TeamEntity;
}