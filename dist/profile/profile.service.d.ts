import { PurchaseEntity } from 'src/purchase/entities/purchase.entity';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class ProfileService {
    private userRepository;
    private purchaseRepository;
    constructor(userRepository: Repository<UserEntitiy>, purchaseRepository: Repository<PurchaseEntity>);
    changeNickname(user: UserEntitiy, nickname: string): Promise<import("typeorm").UpdateResult>;
    getUserPlan(user: UserEntitiy): Promise<PurchaseEntity[]>;
}
