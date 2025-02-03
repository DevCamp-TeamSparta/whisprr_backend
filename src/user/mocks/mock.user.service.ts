import { JwtPayload } from '../../common/utils/user_info.decorator';
import { UserEntity } from '../entities/user.entity';

export const mockUserService = {
  findUserByUserInfo: jest.fn(),
  findUser: jest.fn(),
  createUser: jest.fn(),
  changeNickname: jest.fn(),
  getUserToken: jest.fn(),
  checkFreetrial: jest.fn(),
  checkPlanActive: jest.fn(),
  updateWritingCount: jest.fn(),
  updateUserTrialStatus: jest.fn(),
  updateTokenVersion: jest.fn(),
};

export const mockUser: UserEntity = {
  user_id: 'mock_uuid',
  nickname: '무명',
  trial_status: 'active',
  writing_count: 0,
  created_at: new Date(),
  deleted_at: null,
  journals: null,
  interviews: null,
  purchases: null,
  journal_creations: null,
  token_version: 1,
};

export const mockUpdatedUser: UserEntity = {
  user_id: 'mock_uuid',
  nickname: 'kelly',
  trial_status: 'active',
  writing_count: 0,
  created_at: new Date(),
  deleted_at: null,
  journals: null,
  interviews: null,
  purchases: null,
  journal_creations: null,
  token_version: 1,
};

export const mockUserInfo: JwtPayload = {
  uuid: 'mock_uuid',
  freeTrialStatus: 'available',
  planStatus: 'non-available',
  tokenVersion: 1,
};

export const mockUserRepository = {
  findOne: jest.fn(),
  increment: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

export const mockUserWithMessag = {
  message: 'A new token has been issued due to expiration. Please retry',
  newToken: 'new Token',
};

export const mockUserInfoExpired: JwtPayload = {
  uuid: mockUser.user_id,
  tokenVersion: 2,
  freeTrialStatus: 'available',
  planStatus: 'available',
};
