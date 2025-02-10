import { UserEntity } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category, Reason } from '../report.reasons';

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['harmful_content', 'user_defined_reason'],
    nullable: false,
  })
  reason: Reason;

  @Column({
    type: 'json',
    nullable: true,
  })
  category: Category[];

  @Column({ type: 'varchar', nullable: true })
  user_defined_reason: string;

  @Column({ type: 'timestamp', nullable: false })
  reported_at: Date;

  @Column({ type: 'date', nullable: false })
  journal_date: Date;

  // m:1 user
  @ManyToOne(() => UserEntity, (user) => user.reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntity;
}
