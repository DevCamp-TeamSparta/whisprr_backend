import { Test, TestingModule } from '@nestjs/testing';
import { InterviewController } from './interview.controller';
import {
  mockUser,
  mockUserInfo,
  mockUserInfoExpired,
  mockUserService,
  mockUserWithMessag,
} from '../user/mocks/mock.user.service';
import { UserService } from '../user/user.service';
import { InterviewService } from './interview.service';
import {
  mockInterviewDto,
  mockInterviewService,
  mockUpdateInterviewDto,
} from './mocks/interview.service.mock';
import { JwtService } from '@nestjs/jwt';
import { JournalService } from '../journal/journal.service';
import { mockJournalService } from '../journal/mocks/journal.service.mock';

describe('InterviewController', () => {
  let interviewController: InterviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterviewController],
      providers: [
        JwtService,
        { provide: UserService, useValue: mockUserService },
        { provide: InterviewService, useValue: mockInterviewService },
        { provide: JournalService, useValue: mockJournalService },
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

    it('user 객체 안에 message 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
      const result = await interviewController.startInterview(
        mockUserInfoExpired,
        mockInterviewDto,
      );
      expect(result).toEqual(mockUserWithMessag);
    });
    it('인터뷰기록을 생성하고 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockInterviewService.startInterview.mockResolvedValue(mockResult);

      const result = await interviewController.startInterview(mockUserInfo, mockInterviewDto);
      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
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

    it('user 객체 안에 messge 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
      const result = await interviewController.startInterview(
        mockUserInfoExpired,
        mockInterviewDto,
      );
      expect(result).toEqual(mockUserWithMessag);
    });
    it('인터뷰기록을 업데이트 하고 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockInterviewService.updateInterview.mockResolvedValue(mockResult);

      const result = await interviewController.updateInterview(
        mockUserInfo,
        mockDate,
        mockUpdateInterviewDto,
      );
      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockInterviewService.updateInterview).toHaveBeenCalledWith(
        mockUser,
        mockDate,
        mockUpdateInterviewDto.interviews,
      );
      expect(result).toEqual(mockResult);
    });
  });
});
