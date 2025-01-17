import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { ProfileService } from './profile.service';
export declare class ProfileController {
    private readonly userService;
    private readonly profileService;
    constructor(userService: UserService, profileService: ProfileService);
    getJournal(userInfo: JwtPayload, nickname: string): Promise<import("typeorm").UpdateResult>;
    getUserPlan(userInfo: JwtPayload): Promise<import("../purchase/entities/purchase.entity").PurchaseEntity[]>;
    getProfile(userInfo: JwtPayload): Promise<import("../user/entities/user.entity").UserEntitiy>;
}
