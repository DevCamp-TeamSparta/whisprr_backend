import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { MoreThan } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { ConfigService } from '@nestjs/config';
import { PurchaseStatus } from './utils/purchase.status';
import {
  mockUser,
  mockUserInfo,
  mockUserInfoExpired,
  mockUserService,
  mockUserWithMessag,
} from '../user/mocks/user.service.mock';
import { mockPlan, mockPlanService } from '../plan/mocks/plan.service.mock';
import { mockPurchase, mockPurchaseRepository } from './mocks/purchase.service.mock';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PlanService } from '../plan/plan.service';

jest.mock('@googleapis/androidpublisher');
jest.mock('google-auth-library');

describe('PurchaseService', () => {
  let purchaseService: PurchaseService;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'PACKAGE_NAME') return 'test.package.name';
        if (key === 'GOOGLE_KEY_FILE') return 'test-key-file.json';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        PurchaseService,
        { provide: getRepositoryToken(PurchaseEntity), useValue: mockPurchaseRepository },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UserService, useValue: mockUserService },
        { provide: PlanService, useValue: mockPlanService },
      ],
    }).compile();

    purchaseService = module.get<PurchaseService>(PurchaseService);
  });

  const mockPurchaseToken = 'test-purchase-token';

  const mockNeWRecord = {
    plan: mockPlan,
    purchase_token: mockPurchaseToken,
    purchase_date: new Date(),
    expiration_date: new Date(),
    status: PurchaseStatus.active,
  };

  const newJwtToken = 'new_generated_token';
  describe('verifyPurchase', () => {
    it('product_id 와 일치 하는 상품이 없으면 Notfoundexception을 반환한다.', async () => {
      mockPlanService.findPlan.mockRejectedValue(new NotFoundException());

      await expect(
        purchaseService.verifyPurchase(mockUserInfo, mockPurchaseToken, 'test'),
      ).rejects.toThrow(NotFoundException);
    });

    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockPlanService.findPlan.mockResolvedValue(mockPlan);
      mockUserService.findUserByUserInfoWhitoutTokenVerify.mockResolvedValue(mockUserWithMessag);

      const result = await purchaseService.verifyPurchase(
        mockUserInfoExpired,
        mockPurchaseToken,
        'test',
      );

      expect(mockPlanService.findPlan).toHaveBeenCalledWith('test');
      expect(result).toEqual(mockUserWithMessag);
    });

    it('구매 토큰으로 검증 하고 구매 정보를 업데이트 한다.', async () => {
      mockPlanService.findPlan.mockResolvedValue(mockPlan);
      mockUserService.findUserByUserInfoWhitoutTokenVerify.mockResolvedValue(mockUser);
      jest.spyOn(purchaseService, 'updatePurchaseRecord').mockResolvedValue(mockNeWRecord);
      mockUserService.getUserToken.mockResolvedValue(newJwtToken);

      const result = await purchaseService.verifyPurchase(mockUserInfo, mockPurchaseToken, 'test');

      expect(result).toEqual({
        ...mockNeWRecord,
        new_token: newJwtToken,
      });

      expect(mockPlanService.findPlan).toHaveBeenCalledWith('test');
      expect(mockUserService.findUserByUserInfoWhitoutTokenVerify).toHaveBeenCalledWith(
        mockUserInfo,
      );
      expect(mockUserService.getUserToken).toHaveBeenCalledWith(mockUser.user_id);
    });
  });

  describe('reciveRTDN', () => {
    const messageMock = {
      data: Buffer.from(
        JSON.stringify({
          subscriptionNotification: {
            notificationType: 1,
            purchaseToken: mockPurchaseToken,
          },
        }),
      ).toString('base64'),
    };

    it('구매 토큰으로 유저 정보가 조회되지 않는다면 리턴하여 메소드를 종료한다.', async () => {
      jest.spyOn(purchaseService, 'findUserByPurchaseToken').mockResolvedValue(null);

      const result = await purchaseService.reciveRTDN(messageMock);

      expect(result).toEqual(undefined);
      expect(purchaseService.findUserByPurchaseToken).toHaveBeenCalledWith(mockPurchaseToken);
    });
    it('RTDN 을 수신하면 google developer api를 호출한다.', async () => {
      jest.spyOn(purchaseService, 'findUserByPurchaseToken').mockResolvedValue(mockPurchase);
      jest.spyOn(purchaseService, 'updatePurchaseRecord').mockResolvedValue(mockNeWRecord);
      mockUserService.updateTokenVersion.mockResolvedValue(undefined);

      await purchaseService.reciveRTDN(messageMock);

      expect(purchaseService.findUserByPurchaseToken).toHaveBeenCalledWith(mockPurchaseToken);
      expect(purchaseService.updatePurchaseRecord).toHaveBeenCalledWith(
        mockUser,
        mockPurchaseToken,
        mockPlan,
      );
      expect(mockUserService.updateTokenVersion).toHaveBeenCalledWith(mockUser.user_id);
    });
  });

  describe('findUserByPurchaseToken', () => {
    it('구매 토큰으로 유저를 찾아 반환한다.', async () => {
      const mockPurchase = {
        user: { id: 'test-user-id' },
      };

      mockPurchaseRepository.findOne.mockResolvedValue(mockPurchase);

      const result = await purchaseService.findUserByPurchaseToken(mockPurchaseToken);

      expect(mockPurchaseRepository.findOne).toHaveBeenCalledWith({
        where: { purchase_token: mockPurchaseToken },
        relations: ['user', 'plan'],
      });
      expect(result).toEqual(mockPurchase);
    });
  });

  describe('getUserPlan', () => {
    it('가입된 플랜이 없거나 만료 시 메세지를 리턴한다.', async () => {
      mockPurchaseRepository.findOne.mockResolvedValue(null);
      const boundGetUserPlan = purchaseService.getUserPlan.bind({
        purchaseRepository: mockPurchaseRepository,
      });

      const result = await boundGetUserPlan(mockUser);

      expect(mockPurchaseRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: mockUser,
          expiration_date: MoreThan(expect.any(Date)),
        },
        relations: ['plan'],
      });
      expect(result).toEqual({ message: 'You are not subscribed to any plan currently' });
    });

    it('가입된 플랜 존재 시 구매정보와 함께 반환한다.', async () => {
      mockPurchaseRepository.findOne.mockResolvedValue(mockPurchase);

      const result = await purchaseService.getUserPlan(mockUser);

      expect(mockPurchaseRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: mockUser,
          expiration_date: MoreThan(expect.any(Date)),
        },
        relations: ['plan'],
      });
      expect(result).toEqual(mockPurchase);
    });
  });
});
