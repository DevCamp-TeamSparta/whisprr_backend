import { PurchaseEntity } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export declare class PurchaseService {
    private purchaseRepository;
    private configService;
    constructor(purchaseRepository: Repository<PurchaseEntity>, configService: ConfigService);
    verifyPurchaseToken(productId: string, purchaseToken: string): Promise<import("@googleapis/androidpublisher").androidpublisher_v3.Schema$SubscriptionPurchase>;
}
