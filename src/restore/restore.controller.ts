import { Controller, Get, Headers } from '@nestjs/common';
import { PurchaseService } from '../purchase/purchase.service';

@Controller('restore')
export class RestoreController {
  constructor(private purchaseService: PurchaseService) {}

  //1. purchasetocken 으로 유저 정보 요청
  @Get()
  async restoreAccount(@Headers('purchaseToken') purchaseToken: string) {
    const account = await this.purchaseService.findUserByPurchaseToken(purchaseToken);
    return account.user;
  }
}
