import { PurchaseService } from './purchase.service';
export declare class PurchaseController {
    private readonly purchaseService;
    constructor(purchaseService: PurchaseService);
    verifyPurchaseToken(purchaseToken: string, productId: string): Promise<import("@googleapis/androidpublisher").androidpublisher_v3.Schema$SubscriptionPurchase>;
}
