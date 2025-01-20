import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
export declare class PlanEntity {
    id: string;
    plan_name: string;
    price: number;
    purchases: PurchaseEntity;
}
