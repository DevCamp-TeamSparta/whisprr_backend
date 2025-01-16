import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  content: string;
}
