import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { JwtService } from '@nestjs/jwt';
import {
  mockUpdatedUser,
  mockUser,
  mockUserInfo,
  mockUserService,
} from '../user/mocks/mock.user.service';

import { mockNicknameDto, mockProfileService } from './mocks/profile.service.mock';
import { mockPlan } from '../plan/mocks/plan.service.mock';
import { ProfileService } from './profile.service';
import { UserService } from '../user/user.service';

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        JwtService,
        { provide: UserService, useValue: mockUserService },
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
  });

  describe('changeNickname', () => {
    it('유저 닉네임을 업데이트 하고 반환한다.', async () => {
      mockProfileService.changeNickname.mockResolvedValue(mockUpdatedUser);

      const result = await profileController.changeNickname(mockUserInfo, mockNicknameDto);

      expect(mockProfileService.changeNickname).toHaveBeenCalledWith(
        mockUserInfo,
        mockNicknameDto.nickname,
      );

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('getUserPlan', () => {
    it('유저가 가입한 플랜을 조회 후 반환한다.', async () => {
      mockProfileService.getUserPlan.mockResolvedValue(mockPlan);

      const result = await profileController.getUserPlan(mockUserInfo);

      expect(mockProfileService.getUserPlan).toHaveBeenCalledWith(mockUserInfo);

      expect(result).toEqual(mockPlan);
    });
  });

  describe('getProfile', () => {
    it('유저의 프로필 정보를 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);

      const result = await profileController.getProfile(mockUserInfo);
      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);

      expect(result).toEqual(mockUser);
    });
  });
});
