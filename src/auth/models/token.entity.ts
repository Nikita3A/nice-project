import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
@Entity()
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  token: string;

  @Column()
  created_at: Date;
}