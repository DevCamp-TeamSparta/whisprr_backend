import { JournalCreationEntity } from '../../journal/entities/journal.creation.entity';
import { InterviewEntity } from '../../interview/entities/interview.entity';
import { JournalEntity } from '../../journal/entities/journal.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { Entity, Column, OneToMany, PrimaryColumn, OneToOne } from 'typeorm';
import { ReportEntity } from '../../report/entities/report.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'binary', length: 16 })
  user_id: Buffer;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: '무명',
  })
  nickname: string;

  @Column({
    type: 'enum',
    enum: ['active', 'expired'],
    default: 'active',
    nullable: false,
  })
  trial_status: string;

  @Column({ type: 'int', default: 0, nullable: false })
  writing_count: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  token_version: number;

  @Column({ type: 'timestamp', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // 1 : M journals
  @OneToMany(() => JournalEntity, (journals) => journals.user, { onDelete: 'CASCADE' })
  journals: JournalEntity[];

  //1 : m interviews
  @OneToMany(() => InterviewEntity, (interviews) => interviews.user, { onDelete: 'CASCADE' })
  interviews: InterviewEntity[];

  //1 : 1 purchase_infos
  @OneToOne(() => PurchaseEntity, (purchase) => purchase.user, { onDelete: 'CASCADE' })
  purchases: PurchaseEntity;

  //1: m journal_creations
  @OneToMany(() => JournalCreationEntity, (jouranl_creations) => jouranl_creations.user, {
    onDelete: 'CASCADE',
  })
  journal_creations: JournalCreationEntity[];

  //1: m reports
  @OneToMany(() => ReportEntity, (report) => report.user, {
    onDelete: 'CASCADE',
  })
  reports: ReportEntity[];
}
