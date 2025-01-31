import { Test, TestingModule } from '@nestjs/testing';
import { JournalController } from './journal.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  mockUser,
  mockUserInfo,
  mockUserInfoExpired,
  mockUserService,
  mockUserWithMessag,
} from '../user/mocks/mock.user.service';
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
    it('user 객체 안에 message 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
      const result = await journalController.createJournal(mockUserInfoExpired, mockJournalDto);
      expect(result).toEqual(mockUserWithMessag);
    });

    it('저널을 생성하고 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockInterviewService.findInterview.mockResolvedValue(mockUpdatedInterview);
      mockInstructionService.getInstruction.mockResolvedValue(mockJournalInstruction);
      mockOpenAiService.getJournalByAI.mockResolvedValue(mockJournalByAI);
      mockJournalService.createJournal.mockResolvedValue(mockJournal);

      const result = await journalController.createJournal(mockUserInfo, mockJournalDto);
      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
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
    const mockLastDateString = '2025-01-20';
    const mockLastDate = new Date(mockLastDateString);
    const mockLimit = 5;
    describe('createJournal', () => {
      it('user 객체 안에 message 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
        const result = await journalController.getJournalList(
          mockUserInfoExpired,
          mockLastDateString,
          mockLimit,
        );
        expect(result).toEqual(mockUserWithMessag);
      });

      it('저널 목록을 반환한다.', async () => {
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
        mockJournalService.getJournalList.mockResolvedValue(mockJournalList);

        const result = await journalController.getJournalList(
          mockUserInfo,
          mockLastDateString,
          mockLimit,
        );
        expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
        expect(mockJournalService.getJournalList).toHaveBeenCalledWith(
          mockUser,
          mockLastDate,
          mockLimit,
        );

        expect(result).toEqual(mockJournalList);
      });
    });

    describe('getJournal', () => {
      it('user 객체 안에 message 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
        const result = await journalController.getJournal(mockUserInfoExpired, 1);
        expect(result).toEqual(mockUserWithMessag);
      });
      it('저널 상세를 반환한다.', async () => {
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
        mockJournalService.getJournal.mockResolvedValue(mockJournal);

        const result = await journalController.getJournal(mockUserInfo, 1);
        expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
        expect(mockJournalService.getJournal).toHaveBeenCalledWith(mockUser, 1);

        expect(result).toEqual(mockJournal);
      });
    });

    describe('getJournalByDate', () => {
      it('user 객체 안에 message 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
        const result = await journalController.getJournalByDate(mockUserInfoExpired, mockDate);
        expect(result).toEqual(mockUserWithMessag);
      });
      it('날짜 별 저널 상세를 반환한다.', async () => {
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
        mockJournalService.getJournalByDate.mockResolvedValue(mockJournal);

        const result = await journalController.getJournalByDate(mockUserInfo, mockDate);
        expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
        expect(mockJournalService.getJournalByDate).toHaveBeenCalledWith(mockUser, mockDate);

        expect(result).toEqual(mockJournal);
      });
    });

    describe('deleteJournal', () => {
      it('user 객체 안에 messge 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
        const result = await journalController.deleteJournal(mockUserInfoExpired, mockDate);
        expect(result).toEqual(mockUserWithMessag);
      });
      it('날짜를 식별자로 저널 기록을 삭제한다', async () => {
        const mockMessage = { message: `journal id :1, date:${mockDate} removed` };
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
        mockJournalService.deleteJournal.mockResolvedValue(mockMessage);

        const result = await journalController.deleteJournal(mockUserInfo, mockDate);
        expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
        expect(mockJournalService.deleteJournal).toHaveBeenCalledWith(mockUser, mockDate);

        expect(result).toEqual(mockMessage);
      });
    });

    describe('updateJournal', () => {
      it('user 객체 안에 message 프로퍼티가 있으면 user객체를 리턴한다.', async () => {
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);
        const result = await journalController.updateJournal(
          mockUserInfoExpired,
          mockDate,
          mockJournalUpdateDto,
        );
        expect(result).toEqual(mockUserWithMessag);
      });
      it('날짜를 식별자로 저널 기록을 수정한다', async () => {
        mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
        mockJournalService.updateJournal.mockResolvedValue(mockUpdatedJournal);

        const result = await journalController.updateJournal(
          mockUserInfo,
          mockDate,
          mockJournalUpdateDto,
        );
        expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
        expect(mockJournalService.updateJournal).toHaveBeenCalledWith(
          mockUser,
          mockDate,
          mockJournalUpdateDto,
        );

        const mockResult = { ...result, updated_at: new Date('2025-01-23T02:42:37.574Z') };

        expect(mockResult).toEqual(mockUpdatedJournal);
      });
    });
  });
});
