import { UserEntity } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Unique,
  DeleteDateColumn,
} from 'typeorm';

@Entity('journals')
@Unique(['user', 'date'])
export class JournalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'json',
    nullable: false,
  })
  keyword: string[];

  @Column({ type: 'longtext', nullable: false })
  content: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'timestamp', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // m:1 user
  @ManyToOne(() => UserEntity, (user) => user.journals)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntity;
}
