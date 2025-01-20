import { Controller, Get, Headers } from '@nestjs/common';
import { RestoreService } from './restore.service';
import { PurchaseService } from 'src/purchase/purchase.service';

@Controller('restore')
export class RestoreController {
  constructor(
    private restoreService: RestoreService,
    private purchaseService: PurchaseService,
  ) {}

  @Get()
  async restoreAccount(@Headers('purchaseToken') purchaseToken: string) {
    const account = await this.purchaseService.findUserByPurchaseToken(purchaseToken);
    return account.user;
  }
}
