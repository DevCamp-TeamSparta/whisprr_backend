import { InterviewEntity } from '../../interview/entities/interview.entity';
import { JournalEntity } from '../../journal/entities/journal.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { Entity, Column, JoinColumn, OneToMany, Binary, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntitiy {
  @PrimaryColumn({ type: 'binary', length: 16 })
  user_id: Buffer;

  @Column({
    type: 'varchar',
    nullable: false,
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

  @Column({ type: 'timestamp', nullable: false })
  deleted_at: Date;

  // 1 : M journals
  @OneToMany(() => JournalEntity, (journals) => journals.user)
  journals: JournalEntity[];

  //1 : m interviews
  @OneToMany(() => InterviewEntity, (interviews) => interviews.user)
  interviews: InterviewEntity[];

  //1 : m purchase_infos
  @OneToMany(() => PurchaseEntity, (purchases) => purchases.user)
  purchases: PurchaseEntity[];
}
