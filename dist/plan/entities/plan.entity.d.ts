import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
export declare class PlanEntity {
    id: number;
    plan_name: string;
    price: number;
    purchases: PurchaseEntity;
}
