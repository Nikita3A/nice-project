import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  token: string;
}