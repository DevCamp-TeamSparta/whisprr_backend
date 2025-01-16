import { UserEntitiy } from '../../user/entities/user.entity';
import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PurchaseStatus } from '../utils/purchase.status';
import { PlanEntity } from '../../plan/entities/plan.entity';

@Entity('purchases')
export class PurchaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  purchase_tocken: string;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.inactive,
    nullable: false,
  })
  status: PurchaseStatus;

  @Column({ type: 'timestamp', nullable: false })
  purchase_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  expiration_date: Date;

  //m: 1 user
  @ManyToOne(() => UserEntitiy, (user) => user.purchases)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntitiy;

  //m: 1 plan
  @ManyToOne(() => PlanEntity, (plan: { purchases: any }) => plan.purchases)
  @JoinColumn({ name: 'plan_id', referencedColumnName: 'id' })
  plan: PlanEntity;
}
