import { UserEntity } from '../../user/entities/user.entity';
import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

@Entity('interviews')
@Unique(['user', 'date'])
export class InterviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  content: string[];

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'json', nullable: true })
  question_id: number[];

  @Column({ type: 'timestamp', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  //m: 1 user
  @ManyToOne(() => UserEntity, (user) => user.interviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntity;
}
