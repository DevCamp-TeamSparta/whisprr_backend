import { Test, TestingModule } from '@nestjs/testing';
import { InterviewController } from './interview.controller';
import { mockUser, mockUserInfo, mockUserService } from '../user/mocks/user.service.mock';
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
      question_id: null,
      date: '2025-01-20',
      created_at: new Date(),
      user: mockUser,
      deleted_at: null,
      id: 1,
    };

    it('인터뷰기록을 생성하고 반환한다.', async () => {
      mockInterviewService.startInterview.mockResolvedValue(mockResult);

      const result = await interviewController.startInterview(mockUserInfo, mockInterviewDto);
      expect(mockInterviewService.startInterview).toHaveBeenCalledWith(
        mockUserInfo,
        mockInterviewDto.date,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateInterview', () => {
    const mockResult = {
      content: [{ question: 'test?', answer: 'test' }],
      question_id: [1],
      date: '2025-01-20',
      created_at: new Date(),
      user: mockUser,
      deleted_at: null,
      id: 1,
    };

    const mockDate: Date = new Date('2025-01-20');

    it('인터뷰기록을 업데이트 하고 반환한다.', async () => {
      mockInterviewService.updateInterview.mockResolvedValue(mockResult);

      const result = await interviewController.updateInterview(
        mockUserInfo,
        mockDate,
        mockUpdateInterviewDto,
      );
      expect(mockInterviewService.updateInterview).toHaveBeenCalledWith(
        mockUserInfo,
        mockDate,
        mockUpdateInterviewDto.interviews,
        mockUpdateInterviewDto.questionId,
      );
      expect(result).toEqual(mockResult);
    });
  });
});
