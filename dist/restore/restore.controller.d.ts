import { RestoreService } from './restore.service';
import { PurchaseService } from 'src/purchase/purchase.service';
export declare class RestoreController {
    private restoreService;
    private purchaseService;
    constructor(restoreService: RestoreService, purchaseService: PurchaseService);
    restoreAccount(purchaseToken: string): Promise<import("../user/entities/user.entity").UserEntitiy>;
}
