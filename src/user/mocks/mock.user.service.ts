import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { UserEntitiy } from '../entities/user.entity';

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

export const mockUser: UserEntitiy = {
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

export const mockUserInfo: JwtPayload = {
  uuid: 'mock_uuid',
  freeTrialStatus: 'available',
  planStatus: 'non-available',
};
