import { UserEntitiy } from '../../user/entities/user.entity';
import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('interviews')
export class InterviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  content: string[];

  @Column({ type: 'timestamp', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  //m: 1 user
  @ManyToOne(() => UserEntitiy, (user) => user.interviews)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntitiy;
}
