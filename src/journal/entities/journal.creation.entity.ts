import { UserEntity } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity('journal_creations')
export class JournalCreationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  journal_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  created_at: Date;

  // m:1 user
  @ManyToOne(() => UserEntity, (user) => user.journal_creations)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntity;
}
