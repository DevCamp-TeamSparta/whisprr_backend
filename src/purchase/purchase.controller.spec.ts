import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { UserService } from '../user/user.service';
import { PlanService } from '../plan/plan.service';
import { mockPurchaseService } from './mocks/purchase.service.mock';
import {
  mockUser,
  mockUserInfo,
  mockUserInfoExpired,
  mockUserService,
  mockUserWithMessag,
} from '../user/mocks/mock.user.service';
import { mockPlan, mockPlanService } from '../plan/mocks/plan.service.mock';
import { JwtService } from '@nestjs/jwt';

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

  describe('verifyPurchaseToken', () => {
    it('user 객체 안에 message 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
      const result = await purchaseController.verifyPurchaseToken(
        mockUserInfoExpired,
        'test-purchase-token',
        'test-product-id',
      );
      expect(result).toEqual(mockUserWithMessag);
    });
    it('구매 검증 후 jwt 토큰을 재발급 한다.', async () => {
      const mockNewToken = 'new-jwt-token';
      const mockResponse = { verified: true };

      mockPlanService.findPlan.mockResolvedValue(mockPlan);
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockUserService.getUserTocken.mockResolvedValue(mockNewToken);
      mockPurchaseService.verifyPurchaseToken.mockResolvedValue(mockResponse);

      const result = await purchaseController.verifyPurchaseToken(
        mockUserInfo,
        'test-purchase-token',
        'test-product-id',
      );

      expect(mockPlanService.findPlan).toHaveBeenCalledWith('test-product-id');
      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockUserService.getUserTocken).toHaveBeenCalledWith(mockUser.user_id);
      expect(mockPurchaseService.verifyPurchaseToken).toHaveBeenCalledWith(
        mockPlan,
        mockUser,
        'test-purchase-token',
      );
      expect(result).toEqual({ ...mockResponse, new_token: mockNewToken });
    });
  });

  describe('getNotification', () => {
    it('알림 수신 시 구매 기록을 업데이트 한다.', async () => {
      const mockMessage = { data: 'test-message' };

      mockPurchaseService.updatePurchaseTable.mockResolvedValue(undefined);

      await purchaseController.getNotification(mockMessage);

      expect(mockPurchaseService.updatePurchaseTable).toHaveBeenCalledWith(mockMessage);
    });
  });
});
