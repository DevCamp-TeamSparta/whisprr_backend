import { PurchaseService } from './purchase.service';
import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { PlanService } from 'src/plan/plan.service';
export declare class PurchaseController {
    private readonly purchaseService;
    private readonly userService;
    private readonly planService;
    constructor(purchaseService: PurchaseService, userService: UserService, planService: PlanService);
    verifyPurchaseToken(userInfo: JwtPayload, purchaseToken: string, productId: string): Promise<{
        new_token: string;
        plan: import("../plan/entities/plan.entity").PlanEntity;
        purchase_token: string;
        purchase_date: Date;
        expiration_date: Date;
        status: import("./utils/purchase.status").PurchaseStatus;
    }>;
    getNotification(message: any): Promise<string>;
}
