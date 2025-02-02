import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { MoreThan } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { ConfigService } from '@nestjs/config';
import { PurchaseStatus } from './utils/purchase.status';
import { mockUser, mockUserService } from '../user/mocks/mock.user.service';
import { mockPlan } from '../plan/mocks/plan.service.mock';
import { mockPurchase, mockPurchaseRepository } from './mocks/purchase.service.mock';
import { NotFoundException } from '@nestjs/common';
import { androidpublisher } from '@googleapis/androidpublisher';
import { UserService } from '../user/user.service';

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
      ],
    }).compile();

    purchaseService = module.get<PurchaseService>(PurchaseService);
  });

  const mockResponse = {
    data: {
      startTimeMillis: '1672531200000',
      expiryTimeMillis: '1675119600000',
      cancelReason: null,
    },
  };

  describe('verifyPurchaseToken', () => {
    it('구매 토큰으로 검증 하고 구매 정보를 업데이트 한다.', async () => {
      const mockPurchaseToken = 'test-purchase-token';

      jest.spyOn(purchaseService, 'updatePurchaseRecord').mockResolvedValue(mockPurchase);
      const mockAndroidPublisherClient = {
        purchases: {
          subscriptions: {
            get: jest.fn().mockResolvedValue(mockResponse),
          },
        },
      } as unknown as ReturnType<typeof androidpublisher>;

      jest
        .spyOn(purchaseService, 'getAndroidPublisherClient')
        .mockResolvedValue(mockAndroidPublisherClient);

      mockConfigService.get = jest.fn((key: string) => {
        if (key === 'PACKAGE_NAME') return 'test.package.name';
        return null;
      });

      const result = await purchaseService.verifyPurchaseToken(
        mockPlan,
        mockUser,
        mockPurchaseToken,
      );

      expect(purchaseService.getAndroidPublisherClient).toHaveBeenCalled();
      expect(mockAndroidPublisherClient.purchases.subscriptions.get).toHaveBeenCalledWith({
        packageName: mockConfigService.get('PACKAGE_NAME'),
        subscriptionId: 'test',
        token: 'test-purchase-token',
      });
      expect(purchaseService.updatePurchaseRecord).toHaveBeenCalledWith(
        mockResponse.data,
        mockUser,
        mockPurchaseToken,
        mockPlan,
      );
      expect(result).toEqual(mockPurchase);
    });
  });

  describe('updatePurchaseRecord', () => {
    it('구매 정보를 업데이트 한다.', async () => {
      const mockResponse = {
        data: {
          startTimeMillis: '1672531200000',
          expiryTimeMillis: '1675119600000',
          cancelReason: null,
        },
      };

      const mockPurchaseToken = 'test-purchase-token';

      const expectedPurchaseDate = new Date(Number(mockResponse.data.startTimeMillis));
      const expectedExpirationDate = new Date(Number(mockResponse.data.expiryTimeMillis));

      const mockPurchase = {
        user: mockUser,
        plan: mockPlan,
        purchase_token: mockPurchaseToken,
        purchase_date: expectedPurchaseDate,
        expiration_date: expectedExpirationDate,
        status: PurchaseStatus.inactive,
      };

      mockPurchaseRepository.findOne.mockResolvedValue(mockPurchase);
      mockPurchaseRepository.update.mockResolvedValue(null);

      const result = await purchaseService.updatePurchaseRecord(
        mockResponse.data,
        mockUser,
        mockPurchaseToken,
        mockPlan,
      );

      expect(mockPurchaseRepository.findOne).toHaveBeenCalledWith({ where: { user: mockUser } });
      expect(mockPurchaseRepository.update).toHaveBeenCalledWith(
        { user: mockUser },
        {
          plan: mockPlan,
          purchase_token: mockPurchaseToken,
          purchase_date: expectedPurchaseDate,
          expiration_date: expectedExpirationDate,
          status: PurchaseStatus.inactive,
        },
      );
      expect(result.status).toEqual(PurchaseStatus.inactive);
    });
  });

  describe('updatePurchaseTable', () => {
    it('알림 종류에 따라 구매 상태를 업데이트 한다.', async () => {
      const mockMessage = {
        data: Buffer.from(
          JSON.stringify({
            subscriptionNotification: {
              notificationType: 1,
              purchaseToken: 'test-purchase-token',
            },
          }),
        ).toString('base64'),
      };

      mockPurchaseRepository.update.mockResolvedValue(null);
      jest
        .spyOn(purchaseService as any, 'checkStatus')
        .mockResolvedValue({ status: PurchaseStatus.active });

      await purchaseService.updatePurchaseTable(mockMessage);

      expect(mockPurchaseRepository.update).toHaveBeenCalledWith(
        { purchase_token: 'test-purchase-token' },
        { status: PurchaseStatus.active },
      );
    });
  });

  describe('findUserByPurchaseToken', () => {
    it('구매 토큰으로 유저를 찾지 못했을 때 NotFoundException 을 전달한다. ', async () => {
      mockPurchaseRepository.findOne.mockResolvedValue(null);

      await expect(purchaseService.findUserByPurchaseToken('invalid-token')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('구매 토큰으로 유저를 찾아 반환한다.', async () => {
      const mockPurchase = {
        user: { id: 'test-user-id' },
      };

      mockPurchaseRepository.findOne.mockResolvedValue(mockPurchase);

      const result = await purchaseService.findUserByPurchaseToken('test-purchase-token');

      expect(mockPurchaseRepository.findOne).toHaveBeenCalledWith({
        where: { purchase_token: 'test-purchase-token' },
        relations: ['user'],
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
