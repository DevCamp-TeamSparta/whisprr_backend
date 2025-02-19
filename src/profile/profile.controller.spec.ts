import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { JwtService } from '@nestjs/jwt';
import {
  mockUpdatedUser,
  mockUser,
  mockUserInfo,
  mockUserInfoExpired,
  mockUserService,
  mockUserWithMessag,
} from '../user/mocks/user.service.mock';
import { UserService } from '../user/user.service';

import { mockNicknameDto, mockProfileService } from './mocks/profile.service.mock';
import { mockPlan } from '../plan/mocks/plan.service.mock';
import { PurchaseService } from '../purchase/purchase.service';
import { mockPurchaseService } from 'src/purchase/mocks/purchase.service.mock';

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        JwtService,
        { provide: UserService, useValue: mockUserService },
        { provide: PurchaseService, useValue: mockPurchaseService },
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
  });

  describe('changeNickname', () => {
    it('user 객체 안에 messge 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
      const result = await profileController.changeNickname(mockUserInfoExpired, mockNicknameDto);
      expect(result).toEqual(mockUserWithMessag);
    });
    it('유저 닉네임을 업데이트 하고 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockProfileService.changeNickname.mockResolvedValue(mockUpdatedUser);

      const result = await profileController.changeNickname(mockUserInfo, mockNicknameDto);
      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockProfileService.changeNickname).toHaveBeenCalledWith(
        mockUser,
        mockNicknameDto.nickname,
      );

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('getUserPlan', () => {
    it('user 객체 안에 message 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
      const result = await profileController.getUserPlan(mockUserInfoExpired);
      expect(result).toEqual(mockUserWithMessag);
    });
    it('유저가 가입한 플랜을 조회 후 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockPurchaseService.getUserPlan.mockResolvedValue(mockPlan);

      const result = await profileController.getUserPlan(mockUserInfo);
      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockPurchaseService.getUserPlan).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual(mockPlan);
    });
  });

  describe('getProfile', () => {
    it('user 객체 안에 message 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
      const result = await profileController.getProfile(mockUserInfoExpired);
      expect(result).toEqual(mockUserWithMessag);
    });
    it('유저의 프로필 정보를 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);

      const result = await profileController.getProfile(mockUserInfo);
      expect(mockUserService.findUserByUserInfoWhitoutTokenVerify).toHaveBeenCalledWith(
        mockUserInfo,
      );

      expect(result).toEqual(mockUser);
    });
  });
});
