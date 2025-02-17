import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('parses_after_interview')
export class ParseAfterInterviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  content: string;
}
