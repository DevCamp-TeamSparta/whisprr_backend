import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import {
  mockUpdatedUser,
  mockUser,
  mockUserInfo,
  mockUserInfoExpired,
  mockUserRepository,
  mockUserWithMessag,
} from './mocks/mock.user.service';
import { parse as uuidParse } from 'uuid';

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

  jest.mock('uuid', () => ({
    v4: jest.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
  }));

  describe('findUserByUserInfo', () => {
    const mockNewToken = 'new Token';
    it('유저 정보가 없으면 NotFoundException을 전달한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.findUserByUserInfo(mockUserInfo)).rejects.toThrow(NotFoundException);
    });

    it('토큰 버젼이 일치 하지 않으면 메세지와 새로 생성한 토큰을 반환한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      userService.getUserToken = jest.fn().mockResolvedValue(mockNewToken);

      const result = await userService.findUserByUserInfo(mockUserInfoExpired);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: Buffer.from(uuidParse(mockUserInfoExpired.uuid)) },
      });

      expect(result).toEqual(mockUserWithMessag);
    });

    it('유저 정보가 존재하고 토큰 버젼이 일치 하면 유저 정보를 반환한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.findUserByUserInfo(mockUserInfo);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: Buffer.from(uuidParse(mockUserInfoExpired.uuid)) },
      });
      expect(result).toEqual(mockUser);
    });
  });

  const mockuuid = '550e8400-e29b-41d4-a716-446655440000';
  const mockBufferuuid = Buffer.from(uuidParse(mockuuid));

  describe('createUser', () => {
    it('유저를 생성하고 반환한다.', async () => {
      const mockUser = { user_id: mockBufferuuid, nickname: '무명', created_at: new Date() };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      await userService.createUser();

      const result = { uuid: mockuuid };

      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ uuid: mockuuid });
    });
  });

  describe('changeNickname', () => {
    it('닉네임을 변경하고 반환한다.', async () => {
      mockUserRepository.update.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(mockUpdatedUser);

      const result = await userService.changeNickname(mockUser, 'kelly');

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        { user_id: mockUser.user_id },
        { nickname: 'kelly' },
      );

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('getUserToken', () => {
    it('uuid 로 jwt 토큰을 발급한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('test-token');

      const result = await userService.getUserToken(mockBufferuuid);

      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(result).toBe('test-token');
    });
  });

  describe('updateWritingCount', () => {
    it('작성 획수를 업데이트 하고 필요 시 trial_status 를 업데이트 한다.', async () => {
      const mockUpdatingUser = {
        user_id: mockBufferuuid,
        nickname: '무명',
        trial_status: 'active',
        writing_count: 2,
        created_at: new Date(),
        deleted_at: null,
        journals: null,
        interviews: null,
        purchases: null,
        journal_creations: null,
        token_version: 1,
        reports: null,
      };

      mockUserRepository.findOne.mockResolvedValueOnce({
        ...mockUpdatingUser,
        writing_count: 3,
      });

      mockUserRepository.update.mockResolvedValueOnce(null);

      await userService.updateWritingCount(mockUpdatingUser);

      expect(mockUserRepository.increment).toHaveBeenCalledWith(
        { user_id: mockBufferuuid },
        'writing_count',
        1,
      );

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        { user_id: mockBufferuuid },
        { trial_status: 'expired' },
      );
    });

    it('이미 체험 판이 끝나면 작성횟수만 업데이트 한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await userService.updateWritingCount(mockUser);

      expect(mockUserRepository.increment).toHaveBeenCalledWith(
        { user_id: mockBufferuuid },
        'writing_count',
        1,
      );
      expect(mockUserRepository.update).not.toHaveBeenCalledWith(
        { user_id: mockBufferuuid },
        { trial_status: 'expired' },
      );
    });
  });
});
