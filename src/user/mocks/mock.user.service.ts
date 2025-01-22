import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { UserEntity } from '../entities/user.entity';

export const mockUserService = {
  findUserInfos: jest.fn(),
  createUser: jest.fn(),
  changeNickname: jest.fn(),
  getUserTocken: jest.fn(),
  checkFreetrial: jest.fn(),
  checkPlanActive: jest.fn(),
  updateWritingCount: jest.fn(),
  updateUserTrialStatus: jest.fn(),
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
};

export const mockUserInfo: JwtPayload = {
  uuid: 'mock_uuid',
  freeTrialStatus: 'available',
  planStatus: 'non-available',
};

export const mockUserRepository = {
  findOne: jest.fn(),
  increment: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};
