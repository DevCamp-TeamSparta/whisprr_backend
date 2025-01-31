import { Test, TestingModule } from '@nestjs/testing';
import { RestoreController } from './restore.controller';
import { RestoreService } from './restore.service';
import { PurchaseService } from '../purchase/purchase.service';
import { mockPurchaseService } from '../purchase/mocks/purchase.service.mock';
import { mockUser, mockUserService } from '../user/mocks/mock.user.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('RestoreController', () => {
  let restoreController: RestoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestoreController],
      providers: [
        RestoreService,
        JwtService,
        { provide: PurchaseService, useValue: mockPurchaseService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    restoreController = module.get<RestoreController>(RestoreController);
  });

  describe('restoreAccount', () => {
    it('구매 토큰으로 유저 정보를 찾아 반환한다.', async () => {
      const mockPurchaseToken = 'test-purchase-token';

      const mockAccount = {
        user: mockUser,
      };

      mockPurchaseService.findUserByPurchaseToken.mockResolvedValue(mockAccount);

      const result = await restoreController.restoreAccount(mockPurchaseToken);

      expect(mockPurchaseService.findUserByPurchaseToken).toHaveBeenCalledWith(mockPurchaseToken);
      expect(result).toEqual(mockUser);
    });
  });
});
