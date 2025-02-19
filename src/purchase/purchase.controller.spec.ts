import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { UserService } from '../user/user.service';
import { PlanService } from '../plan/plan.service';
import {
  mockPurchaseService,
  mockPurchaseToken,
  mockVerifyResult,
} from './mocks/purchase.service.mock';
import { mockUserInfo, mockUserService } from '../user/mocks/user.service.mock';
import { mockPlanService } from '../plan/mocks/plan.service.mock';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

describe('PurchaseController', () => {
  let purchaseController: PurchaseController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        JwtService,
        { provide: PurchaseService, useValue: mockPurchaseService },
        { provide: UserService, useValue: mockUserService },
        { provide: PlanService, useValue: mockPlanService },
      ],
    }).compile();

    purchaseController = module.get<PurchaseController>(PurchaseController);
  });

  describe('verifyPurchase', () => {
    it('구매 검증 후 jwt 토큰을 재발급 한다.', async () => {
      mockPurchaseService.verifyPurchase.mockResolvedValue(mockVerifyResult);

      const result = await mockPurchaseService.verifyPurchase(
        mockUserInfo,
        mockPurchaseToken,
        'test',
      );

      expect(mockPurchaseService.verifyPurchase).toHaveBeenCalledWith(
        mockUserInfo,
        mockPurchaseToken,
        'test',
      );
      expect(result).toEqual(mockVerifyResult);
    });
  });

  describe('getNotification', () => {
    it('알림 수신 시 구매 기록을 업데이트 한다.', async () => {
      const mockMessage = { data: 'test-message' };

      const resMock = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      mockPurchaseService.reciveRTDN.mockResolvedValue(undefined);

      await purchaseController.getNotification(mockMessage, resMock);

      expect(mockPurchaseService.reciveRTDN).toHaveBeenCalledWith(mockMessage);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.send).toHaveBeenCalledWith('message received');
    });
  });
});
