import { Test, TestingModule } from '@nestjs/testing';
import { InterviewController } from './interview.controller';
import { mockUser, mockUserInfo, mockUserService } from '../user/mocks/mock.user.service';
import { UserService } from '../user/user.service';
import { InterviewService } from './interview.service';
import {
  mockInterviewDto,
  mockInterviewService,
  mockUpdateInterviewDto,
} from './mocks/interview.service.mock';
import { JwtService } from '@nestjs/jwt';

describe('InterviewController', () => {
  let interviewController: InterviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterviewController],
      providers: [
        JwtService,
        { provide: UserService, useValue: mockUserService },
        { provide: InterviewService, useValue: mockInterviewService },
      ],
    }).compile();

    interviewController = module.get<InterviewController>(InterviewController);
  });

  describe('startInterview', () => {
    const mockResult = {
      content: [],
      date: '2025-01-20',
      created_at: new Date(),
      user: mockUser,
      deleted_at: null,
      id: 1,
    };
    it('인터뷰기록을 생성하고 반환한다.', async () => {
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockInterviewService.startInterview.mockResolvedValue(mockResult);

      const result = await interviewController.startInterview(mockUserInfo, mockInterviewDto);
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockInterviewService.startInterview).toHaveBeenCalledWith(
        mockUser,
        mockInterviewDto.date,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateInterview', () => {
    const mockResult = {
      content: [{ question: 'test?', answer: 'test' }],
      date: '2025-01-20',
      created_at: new Date(),
      user: mockUser,
      deleted_at: null,
      id: 1,
    };

    const mockDate: Date = new Date('2025-01-20');
    it('인터뷰기록을 업데이트 하고 반환한다.', async () => {
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockInterviewService.updateInterview.mockResolvedValue(mockResult);

      const result = await interviewController.updateInterview(
        mockUserInfo,
        mockDate,
        mockUpdateInterviewDto,
      );
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockInterviewService.updateInterview).toHaveBeenCalledWith(
        mockUser,
        mockDate,
        mockUpdateInterviewDto.interviews,
      );
      expect(result).toEqual(mockResult);
    });
  });
});
