import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('plans')
export class PlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  plan_name: string;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 3,
    default: 0,
    nullable: false,
  })
  price: number;

  //1: m purchases
  @OneToMany(() => PurchaseEntity, (purchases) => purchases.plan)
  purchases: PurchaseEntity;
}
