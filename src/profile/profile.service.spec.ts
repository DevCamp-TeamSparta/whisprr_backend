import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import {
  mockUser,
  mockUserInfo,
  mockUserInfoExpired,
  mockUserRepository,
  mockUserService,
  mockUserWithMessag,
} from '../user/mocks/mock.user.service';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import {
  mockPurchase,
  mockPurchaseRepository,
  mockPurchaseService,
} from '../purchase/mocks/purchase.service.mock';
import { mockNicknameDto } from './mocks/profile.service.mock';
import { ProfileService } from './profile.service';
import { UserService } from '../user/user.service';
import { PurchaseService } from '../purchase/purchase.service';

describe('ProfileService', () => {
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        JwtService,
        { provide: UserService, useValue: mockUserService },
        { provide: PurchaseService, useValue: mockPurchaseService },
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
    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);

      const result = await profileService.changeNickname(
        mockUserInfoExpired,
        mockNicknameDto.nickname,
      );

      expect(result).toEqual(mockUserWithMessag);
    });

    it('유저 닉네임을 변경하고 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockUserService.changeNickname.mockResolvedValue({
        ...mockUser,
        nicknme: mockNicknameDto.nickname,
      });

      const result = await profileService.changeNickname(
        mockUserInfoExpired,
        mockNicknameDto.nickname,
      );

      expect(mockUserService.changeNickname).toHaveBeenCalledWith(
        mockUser,
        mockNicknameDto.nickname,
      );
      expect(result).toEqual({ ...mockUser, nicknme: mockNicknameDto.nickname });
    });
  });

  describe('getUserPlan', () => {
    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);

      const result = await profileService.getUserPlan(mockUserInfoExpired);

      expect(result).toEqual(mockUserWithMessag);
    });
    it('가입된 플랜 존재 시 구매정보와 함께 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockPurchaseService.getUserPlan.mockResolvedValue({
        mockPurchase,
      });

      await profileService.getUserPlan(mockUserInfo);
      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockPurchaseService.getUserPlan).toHaveBeenCalledWith(mockUser);
    });
  });
});
