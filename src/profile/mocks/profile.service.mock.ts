import { NicknameDto } from '../dto/create_nickname.dto';

export const mockProfileService = {
  changeNickname: jest.fn(),
  getUserPlan: jest.fn(),
};

export const mockNicknameDto: NicknameDto = {
  nickname: 'kelly',
};
