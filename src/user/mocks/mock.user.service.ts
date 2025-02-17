import { JwtPayload } from '../../common/utils/user_info.decorator';
import { UserEntity } from '../entities/user.entity';
import { parse as uuidParse } from 'uuid';

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
  findUserByUserInfoWhitoutTokenVerify: jest.fn(),
};

export const mockUser: UserEntity = {
  user_id: Buffer.from(uuidParse('550e8400-e29b-41d4-a716-446655440000')),
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
  reports: null,
  user_custom_questions: null,
};

export const mockUpdatedUser: UserEntity = {
  user_id: Buffer.from(uuidParse('550e8400-e29b-41d4-a716-446655440000')),
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
  reports: null,
  user_custom_questions: null,
};

export const mockUserInfo: JwtPayload = {
  uuid: '550e8400-e29b-41d4-a716-446655440000',
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
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  tokenVersion: 2,
  freeTrialStatus: 'available',
  planStatus: 'available',
};
