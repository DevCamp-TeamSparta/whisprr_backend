import { UserEntitiy } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity('journals')
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

  @Column({ type: 'date', nullable: false, unique: true })
  date: Date;

  @Column({ type: 'timestamp', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // m:1 user
  @ManyToOne(() => UserEntitiy, (user) => user.journals)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntitiy;
}
