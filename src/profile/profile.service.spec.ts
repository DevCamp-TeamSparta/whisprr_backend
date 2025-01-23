import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { mockUpdatedUser, mockUser, mockUserRepository } from '../user/mocks/mock.user.service';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { mockPurchase, mockPurchaseRepository } from '../purchase/mocks/purchase.service.mock';
import { mockNicknameDto } from './mocks/profile.service.mock';
import { MoreThan } from 'typeorm';

describe('ProfileService', () => {
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(PurchaseEntity),
          useValue: mockPurchaseRepository,
        },
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
  });

  describe('changeNickname', () => {
    it('유저 닉네임을 변경하고 반환한다.', async () => {
      mockUserRepository.update.mockReturnValue(null);
      mockUserRepository.findOne.mockReturnValue(mockUpdatedUser);

      const result = await profileService.changeNickname(mockUser, mockNicknameDto.nickname);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUser.user_id },
      });

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('getUserPlan', () => {
    it('가입된 플랜이 없거나 만료 시 메세지를 리턴한다.', async () => {
      mockPurchaseRepository.findOne.mockResolvedValue(null);
      const boundGetUserPlan = profileService.getUserPlan.bind({
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

      const result = await profileService.getUserPlan(mockUser);

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
