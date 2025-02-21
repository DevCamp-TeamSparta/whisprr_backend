import { Injectable } from '@nestjs/common';

import { PurchaseService } from 'src/purchase/purchase.service';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from 'src/common/utils/user_info.decorator';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly purchaseService: PurchaseService,
  ) {}

  //1. 닉네임 변경
  async changeNickname(userInfo: JwtPayload, nickname: string) {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);

    return await this.userService.changeNickname(user, nickname);
  }

  //2. 가입된 플랜 확인(구매 정보 함께 반환)
  async getUserPlan(userInfo: JwtPayload) {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);

    return await this.purchaseService.getUserPlan(user);
  }
}
