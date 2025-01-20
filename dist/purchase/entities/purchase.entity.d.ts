import { UserEntitiy } from '../../user/entities/user.entity';
import { PurchaseStatus } from '../utils/purchase.status';
import { PlanEntity } from '../../plan/entities/plan.entity';
export declare class PurchaseEntity {
    id: number;
    purchase_token: string;
    status: PurchaseStatus;
    purchase_date: Date;
    expiration_date: Date;
    user: UserEntitiy;
    plan: PlanEntity;
}
