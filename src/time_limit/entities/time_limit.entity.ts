import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('time_limits')
export class TimeLimitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  limit: number;
}
