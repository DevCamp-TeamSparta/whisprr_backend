import { UserEntity } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../report.reasons';

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  reason: Category[];

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
