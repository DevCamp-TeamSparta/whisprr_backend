import { Controller, Get, Query } from '@nestjs/common';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  async verifyPurchaseToken(
    @Query('purchaseToken') purchaseToken: string,
    @Query('productId') productId: string,
  ) {
    return await this.purchaseService.verifyPurchaseToken(productId, purchaseToken);
  }
}
