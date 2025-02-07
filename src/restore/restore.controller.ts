import { Controller, Get, Headers, NotFoundException } from '@nestjs/common';
import { PurchaseService } from '../purchase/purchase.service';
import { stringify as uuidStringify } from 'uuid';

@Controller('restore')
export class RestoreController {
  constructor(private purchaseService: PurchaseService) {}

  //1. purchasetocken 으로 유저 정보 요청
  @Get()
  async restoreAccount(@Headers('purchaseToken') purchaseToken: string) {
    const account = await this.purchaseService.findUserByPurchaseToken(purchaseToken);
    if (!account) {
      throw new NotFoundException('User not found');
    }
    const uuid = uuidStringify(account.user.user_id);
    return { uuid: uuid };
  }
}
