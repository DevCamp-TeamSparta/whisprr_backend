import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('plans')
export class PlanEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  plan_name: string;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    default: 0,
    nullable: false,
  })
  price: number;

  //1: m purchases
  @OneToMany(() => PurchaseEntity, (purchases) => purchases.plan)
  purchases: PurchaseEntity;
}
