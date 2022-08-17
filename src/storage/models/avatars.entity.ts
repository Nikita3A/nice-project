import { UserEntity } from 'src/users/models/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
@Entity()
export class AvatarsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  link: string;

  @Column({ unique: true })
  name: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity
}