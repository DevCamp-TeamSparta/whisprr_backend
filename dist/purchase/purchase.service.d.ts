import { PurchaseEntity } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PurchaseStatus } from './utils/purchase.status';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
export declare class PurchaseService {
    private purchaseRepository;
    private configService;
    constructor(purchaseRepository: Repository<PurchaseEntity>, configService: ConfigService);
    verifyPurchaseToken(plan: PlanEntity, user: UserEntitiy, purchaseToken: string): Promise<{
        plan: PlanEntity;
        purchase_token: string;
        purchase_date: Date;
        expiration_date: Date;
        status: PurchaseStatus;
    }>;
    updatePurchaseRecord(response: any, user: UserEntitiy, purchaseToken: string, plan: PlanEntity): Promise<{
        plan: PlanEntity;
        purchase_token: string;
        purchase_date: Date;
        expiration_date: Date;
        status: PurchaseStatus;
    }>;
    private findUserPurchaseRecord;
    private checkExpiration;
    updatePurchaseTable(message: any): Promise<void>;
    private checkStatus;
    findUserByPurchaseToken(purchaseToken: string): Promise<PurchaseEntity>;
}
