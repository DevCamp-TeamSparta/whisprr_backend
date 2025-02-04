import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { UserGuard } from '../common/guards/user.guard';
import { JwtPayload, UserInfo } from '../common/utils/user_info.decorator';
import { UserService } from '../user/user.service';
import { PlanService } from '../plan/plan.service';
import { Response } from 'express';

@Controller('purchase')
export class PurchaseController {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly userService: UserService,
    private readonly planService: PlanService,
  ) {}

  //1.구매 검증 요청 및 jwt 토큰 재발급
  @UseGuards(UserGuard)
  @Get('/verify')
  async verifyPurchase(
    @UserInfo() userInfo: JwtPayload,
    @Query('purchaseToken')
    purchaseToken: string,
    @Query('productId') productId: string,
  ) {
    return await this.purchaseService.verifyPurchase(userInfo, purchaseToken, productId);
  }

  //2.구매 변동 시 서버에서 알림 수신 및 구매 상태 업데이트
  @Post('/pubsub')
  async getNotification(@Body('message') message, @Res() res: Response) {
    await this.purchaseService.updatePurchaseTable(message);
    return res.status(200).send('message received');
  }
}
