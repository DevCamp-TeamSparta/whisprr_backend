import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('instructions')
export class instructionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['journal', 'interview'],
    nullable: false,
  })
  target: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  content: string;
}
