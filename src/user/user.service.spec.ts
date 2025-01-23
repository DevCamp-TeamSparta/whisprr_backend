import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { mockUpdatedUser, mockUser, mockUserRepository } from './mocks/mock.user.service';

describe('UserService', () => {
  let userService: UserService;
  let mockJwtService: any;

  beforeEach(async () => {
    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(UserEntity), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('findUserInfos', () => {
    it('유저 정보가 존재하면 반환한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.findUserInfos('mock-uuid');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { user_id: 'mock-uuid' } });
      expect(result).toEqual(mockUser);
    });

    it('우저 정보가 없으면 NotFoundException을 전달한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.findUserInfos('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('유저를 생성하고 반환한다.', async () => {
      const mockUser = { user_id: 'new-uuid', nickname: '무명', created_at: new Date() };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await userService.createUser();

      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser.user_id);
    });
  });

  describe('changeNickname', () => {
    it('닉네임을 변경하고 반환한다.', async () => {
      mockUserRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUpdatedUser);

      const result = await userService.changeNickname(mockUser.user_id, 'kelly');

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        { user_id: mockUser.user_id },
        { nickname: 'kelly' },
      );

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('getUserTocken', () => {
    it('uuid 로 jwt 토큰을 발급한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('test-token');

      const result = await userService.getUserTocken('mock-uuid');

      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(result).toBe('test-token');
    });
  });

  describe('updateWritingCount', () => {
    it('작성 획수를 업데이트 하고 필요 시 trial_status 를 업데이트 한다.', async () => {
      const mockUpdatingUser = {
        user_id: 'mock_uuid',
        nickname: '무명',
        trial_status: 'active',
        writing_count: 2,
        created_at: new Date(),
        deleted_at: null,
        journals: null,
        interviews: null,
        purchases: null,
      };

      mockUserRepository.findOne.mockResolvedValueOnce({
        ...mockUpdatingUser,
        writing_count: 3,
      });

      mockUserRepository.update.mockResolvedValueOnce(null);

      await userService.updateWritingCount(mockUpdatingUser);

      expect(mockUserRepository.increment).toHaveBeenCalledWith(
        { user_id: 'mock_uuid' },
        'writing_count',
        1,
      );

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        { user_id: 'mock_uuid' },
        { trial_status: 'expired' },
      );
    });

    it('이미 체험 판이 끝나면 작성횟수만 업데이트 한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await userService.updateWritingCount(mockUser);

      expect(mockUserRepository.increment).toHaveBeenCalledWith(
        { user_id: 'mock_uuid' },
        'writing_count',
        1,
      );
      expect(mockUserRepository.update).not.toHaveBeenCalledWith(
        { user_id: 'mock_uuid' },
        { trial_status: 'expired' },
      );
    });
  });
});
