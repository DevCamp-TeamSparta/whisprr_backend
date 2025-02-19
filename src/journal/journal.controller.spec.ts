import { Test, TestingModule } from '@nestjs/testing';
import { JournalController } from './journal.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { mockUserInfo, mockUserService } from '../user/mocks/user.service.mock';
import {
  mockJournal,
  mockJournalDto,
  mockJournalList,
  mockJournalService,
  mockJournalUpdateDto,
  mockUpdatedJournal,
} from './mocks/journal.service.mock';
import { JournalService } from './journal.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { mockOpenAiService } from '../open-ai/mocks/openAI.service.mock';
import { InstructionService } from '../instruction/instruction.service';
import { mockInstructionService } from '../instruction/mocks/instruction.service.mock';
import { mockInterviewService } from '../interview/mocks/interview.service.mock';
import { InterviewService } from '../interview/interview.service';

describe('JournalController', () => {
  let journalController: JournalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalController],
      providers: [
        JwtService,
        { provide: UserService, useValue: mockUserService },
        { provide: InterviewService, useValue: mockInterviewService },
        { provide: JournalService, useValue: mockJournalService },
        { provide: OpenAiService, useValue: mockOpenAiService },
        { provide: InstructionService, useValue: mockInstructionService },
      ],
    }).compile();

    journalController = module.get<JournalController>(JournalController);
  });

  const mockDate = new Date('2025-01-20');
  describe('createJournal', () => {
    it('저널을 생성하고 반환한다.', async () => {
      mockJournalService.createJournal.mockResolvedValue(mockJournal);

      const result = await journalController.createJournal(mockUserInfo, mockJournalDto);

      expect(mockJournalService.createJournal).toHaveBeenCalledWith(mockUserInfo, mockJournalDto);

      expect(result).toEqual(mockJournal);
    });
  });

  describe('getJournalList', () => {
    const mockLastDateString = '2025-01-20';
    const mockLastDate = new Date(mockLastDateString);
    const mockLimit = 5;

    it('저널 목록을 반환한다.', async () => {
      mockJournalService.getJournalList.mockResolvedValue(mockJournalList);

      const result = await journalController.getJournalList(
        mockUserInfo,
        mockLastDateString,
        mockLimit,
      );
      expect(mockJournalService.getJournalList).toHaveBeenCalledWith(
        mockUserInfo,
        mockLastDate,
        mockLimit,
      );

      expect(result).toEqual(mockJournalList);
    });
  });

  describe('getJournalByDate', () => {
    it('날짜 별 저널 상세를 반환한다.', async () => {
      mockJournalService.getJournalByDate.mockResolvedValue(mockJournal);

      const result = await journalController.getJournalByDate(mockUserInfo, mockDate);
      expect(mockJournalService.getJournalByDate).toHaveBeenCalledWith(mockUserInfo, mockDate);

      expect(result).toEqual(mockJournal);
    });
  });

  describe('deleteJournal', () => {
    it('날짜를 식별자로 저널 기록을 삭제한다', async () => {
      const mockMessage = { message: `journal id :1, date:${mockDate} removed` };
      mockJournalService.deleteJournal.mockResolvedValue(mockMessage);

      const result = await journalController.deleteJournal(mockUserInfo, mockDate);
      expect(mockJournalService.deleteJournal).toHaveBeenCalledWith(mockUserInfo, mockDate);

      expect(result).toEqual(mockMessage);
    });
  });

  describe('updateJournal', () => {
    it('날짜를 식별자로 저널 기록을 수정한다', async () => {
      mockJournalService.updateJournal.mockResolvedValue(mockUpdatedJournal);

      const result = await journalController.updateJournal(
        mockUserInfo,
        mockDate,
        mockJournalUpdateDto,
      );
      expect(mockJournalService.updateJournal).toHaveBeenCalledWith(
        mockUserInfo,
        mockDate,
        mockJournalUpdateDto,
      );

      const mockResult = { ...result, updated_at: new Date('2025-01-23T02:42:37.574Z') };

      expect(mockResult).toEqual(mockUpdatedJournal);
    });
  });
});
