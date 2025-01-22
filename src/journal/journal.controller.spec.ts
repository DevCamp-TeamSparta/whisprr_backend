import { Test, TestingModule } from '@nestjs/testing';
import { JournalController } from './journal.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { mockUser, mockUserInfo, mockUserService } from '../user/mocks/mock.user.service';
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
import { mockJournalByAI, mockOpenAiService } from '../open-ai/mocks/openAI.service.mock';
import { InstructionService } from '../instruction/instruction.service';
import {
  mockInstructionService,
  mockJournalInstruction,
} from '../instruction/mocks/instruction.service.mock';
import {
  mockInterview,
  mockInterviewService,
  mockUpdatedInterview,
} from '../interview/mocks/interview.service.mock';
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
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockInterviewService.findInterview.mockResolvedValue(mockUpdatedInterview);
      mockInstructionService.getInstruction.mockResolvedValue(mockJournalInstruction);
      mockOpenAiService.getJournalByAI.mockResolvedValue(mockJournalByAI);
      mockJournalService.createJournal.mockResolvedValue(mockJournal);

      const result = await journalController.createJournal(mockUserInfo, mockJournalDto);
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockInterviewService.findInterview).toHaveBeenCalledWith(mockUser, mockDate);
      expect(mockInstructionService.getInstruction).toHaveBeenCalledWith('journal');
      expect(mockOpenAiService.getJournalByAI).toHaveBeenCalledWith(
        mockUpdatedInterview.content,
        mockJournalInstruction.content,
      );
      expect(mockJournalService.createJournal).toHaveBeenCalledWith(
        mockUser,
        mockJournalByAI,
        mockJournalDto.date,
      );

      expect(result).toEqual(mockJournal);
    });
  });

  describe('getJournalList', () => {
    it('저널 목록을 반환한다.', async () => {
      const mockLastDateString = '2025-01-20';
      const mockLastDate = new Date(mockLastDateString);
      const mockLimit = 5;
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockJournalService.getJournalList.mockResolvedValue(mockJournalList);

      const result = await journalController.getJournalList(
        mockUserInfo,
        mockLastDateString,
        mockLimit,
      );
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockJournalService.getJournalList).toHaveBeenCalledWith(
        mockUser,
        mockLastDate,
        mockLimit,
      );

      expect(result).toEqual(mockJournalList);
    });
  });

  describe('getJournal', () => {
    it('저널 상세를 반환한다.', async () => {
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockJournalService.getJournal.mockResolvedValue(mockJournal);

      const result = await journalController.getJournal(mockUserInfo, 1);
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockJournalService.getJournal).toHaveBeenCalledWith(mockUser, 1);

      expect(result).toEqual(mockJournal);
    });
  });

  describe('getJournalByDate', () => {
    it('날짜 별 저널 상세를 반환한다.', async () => {
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockJournalService.getJournalByDate.mockResolvedValue(mockJournal);

      const result = await journalController.getJournalByDate(mockUserInfo, mockDate);
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockJournalService.getJournalByDate).toHaveBeenCalledWith(mockUser, mockDate);

      expect(result).toEqual(mockJournal);
    });
  });

  describe('deleteJournal', () => {
    it('날짜를 식별자로 저널 기록을 삭제한다', async () => {
      const mockMessage = { message: `journal id :1, date:${mockDate} removed` };
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockJournalService.deleteJournal.mockResolvedValue(mockMessage);

      const result = await journalController.deleteJournal(mockUserInfo, mockDate);
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockJournalService.deleteJournal).toHaveBeenCalledWith(mockUser, mockDate);

      expect(result).toEqual(mockMessage);
    });
  });

  describe('updateJournal', () => {
    it('날짜를 식별자로 저널 기록을 수정한다', async () => {
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockJournalService.updateJournal.mockResolvedValue(mockUpdatedJournal);

      const result = await journalController.updateJournal(
        mockUserInfo,
        mockDate,
        mockJournalUpdateDto,
      );
      expect(mockUserService.findUserInfos).toHaveBeenCalledWith(mockUserInfo.uuid);
      expect(mockJournalService.updateJournal).toHaveBeenCalledWith(
        mockUser,
        mockDate,
        mockJournalUpdateDto,
      );

      expect(result).toEqual(mockUpdatedJournal);
    });
  });
});
