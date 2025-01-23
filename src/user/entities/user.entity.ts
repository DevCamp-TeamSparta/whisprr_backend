import { InterviewEntity } from '../../interview/entities/interview.entity';
import { JournalEntity } from '../../journal/entities/journal.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { Entity, Column, OneToMany, PrimaryColumn, OneToOne } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'varchar' })
  user_id: string;

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

  @Column({ type: 'timestamp', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // 1 : M journals
  @OneToMany(() => JournalEntity, (journals) => journals.user)
  journals: JournalEntity[];

  //1 : m interviews
  @OneToMany(() => InterviewEntity, (interviews) => interviews.user)
  interviews: InterviewEntity[];

  //1 : 1 purchase_infos
  @OneToOne(() => PurchaseEntity, (purchase) => purchase.user)
  purchases: PurchaseEntity;
}
