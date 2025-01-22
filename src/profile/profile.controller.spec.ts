import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { JwtService } from '@nestjs/jwt';
import {
  mockUpdatedUser,
  mockUser,
  mockUserInfo,
  mockUserService,
} from '../user/mocks/mock.user.service';
import { UserService } from '../user/user.service';
import { ProfileService } from './profile.service';
import { mockNicknameDto, mockProfileService } from './mocks/profile.service.mock';
import { mockPlan } from '../plan/mocks/plan.service.mock';

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
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockProfileService.changeNickname.mockResolvedValue(mockUpdatedUser);

      const result = await profileController.changeNickname(mockUserInfo, mockNicknameDto);
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockProfileService.changeNickname).toHaveBeenCalledWith(
        mockUser,
        mockNicknameDto.nickname,
      );

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('getUserPlan', () => {
    it('유저가 가입한 플랜을 조회 후 반환한다.', async () => {
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockProfileService.getUserPlan.mockResolvedValue(mockPlan);

      const result = await profileController.getUserPlan(mockUserInfo);
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockProfileService.getUserPlan).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual(mockPlan);
    });
  });

  describe('getProfile', () => {
    it('유저의 프로필 정보를 반환한다.', async () => {
      mockUserService.findUserInfos.mockResolvedValue(mockUser);

      const result = await profileController.getProfile(mockUserInfo);
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);

      expect(result).toEqual(mockUser);
    });
  });
});
