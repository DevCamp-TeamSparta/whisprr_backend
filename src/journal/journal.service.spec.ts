import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal.service';
import { Between, LessThan } from 'typeorm';
import { JournalEntity } from './entities/journal.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockCreatedJournal,
  mockJournal,
  mockJournalCreationRepository,
  mockJournalDto,
  mockJournalList,
  mockJournalRepository,
  mockJournalUpdateDto,
  mockJournalDetails,
  mockUpdatedJournal,
} from './mocks/journal.service.mock';
import {
  mockUser,
  mockUserInfo,
  mockUserInfoExpired,
  mockUserRepository,
  mockUserService,
  mockUserWithMessag,
} from '../user/mocks/mock.user.service';
import { mockJournalByAI, mockOpenAiService } from '../open-ai/mocks/openAI.service.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JournalCreationEntity } from './entities/journal.creation.entity';
import { startOfDay, endOfDay } from 'date-fns';
import { InterviewService } from '../interview/interview.service';
import { mockInterview, mockInterviewService } from '../interview/mocks/interview.service.mock';
import { InstructionService } from '../instruction/instruction.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { InstructionEntity } from '../instruction/entities/instruction.entity';
import { mockInstructionRepository } from '../instruction/mocks/instruction.service.mock';
import { ConfigModule } from '@nestjs/config';

describe('JournalService', () => {
  let journalService: JournalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        JournalService,
        JwtService,
        InstructionService,

        {
          provide: getRepositoryToken(JournalEntity),
          useValue: mockJournalRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(InstructionEntity),
          useValue: mockInstructionRepository,
        },
        {
          provide: getRepositoryToken(JournalCreationEntity),
          useValue: mockJournalCreationRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: OpenAiService,
          useValue: mockOpenAiService,
        },
        { provide: InterviewService, useValue: mockInterviewService },
      ],
    }).compile();

    journalService = module.get<JournalService>(JournalService);

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-20T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const mockDate = new Date('2025-01-20');
  describe('createJournal', () => {
    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);

      const result = await journalService.createJournal(mockUserInfoExpired, mockJournalDto);

      expect(result).toEqual(mockUserWithMessag);
    });

    it('해당 날짜에 이미 생성된 저널이 있으면 ConflictException을 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      jest.spyOn(journalService, 'checkJournalExist').mockRejectedValue(new ConflictException());

      await expect(journalService.createJournal(mockUserInfo, mockJournalDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);

      expect(journalService.checkJournalExist).toHaveBeenCalledWith(mockUser, mockJournalDto.date);
    });

    it('해당 날짜에 중복된 저널이 없으면 저널을 생성하고 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      jest.spyOn(journalService, 'checkJournalExist').mockResolvedValue(null);

      mockJournalRepository.create.mockReturnValue(mockJournal);
      mockJournalRepository.save.mockResolvedValue(mockJournal);
      mockUserService.updateWritingCount.mockResolvedValue(null);

      const result = await journalService.createJournalData(
        mockUser,
        mockJournalByAI,
        mockJournalDto.date,
      );

      expect(mockJournalRepository.create).toHaveBeenCalledWith(mockCreatedJournal);
      expect(mockJournalRepository.save).toHaveBeenCalledWith(mockJournal);

      const returndMockJournal = {
        title: mockJournal.title,
        keyword: mockJournal.keyword,
        content: mockJournal.content,
        date: mockJournal.date,
        created_at: mockJournal.created_at,
        jwtToken: null,
      };

      expect(result).toEqual(returndMockJournal);
    });
  });

  describe('getJournalList', () => {
    const mockLastDate = new Date('2025-01-20');
    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);

      const result = await journalService.getJournalList(mockUserInfoExpired, mockDate, 5);

      expect(result).toEqual(mockUserWithMessag);
    });

    it('저널 목록을 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockJournalRepository.find.mockResolvedValue(mockJournalList);
      const result = await journalService.getJournalList(mockUserInfo, mockLastDate, 5);
      expect(mockJournalRepository.find).toHaveBeenCalledWith({
        where: {
          user: mockUser,
          date: LessThan(mockLastDate),
          deleted_at: null,
        },
        order: { date: 'DESC' },
        take: 5,
      });
      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(result).toEqual(mockJournalList);
    });
  });

  describe('getJournalByDate', () => {
    const mockNoJournalDetails = {
      journalData: null,
      questionIds: mockInterview.question_id,
      message: "The journal doesn't exist on this date",
    };

    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);

      const result = await journalService.getJournalByDate(mockUserInfoExpired, mockDate);

      expect(result).toEqual(mockUserWithMessag);
    });

    it('날짜를 식별자로 해당 저널이 없으면 회고 시 응답한 질문 아이디들 만을 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockJournalRepository.findOne.mockResolvedValue(null);
      mockInterviewService.findInterview.mockResolvedValue(mockInterview);

      const result = await journalService.getJournalByDate(mockUserInfo, mockDate);

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);

      expect(result).toEqual(mockNoJournalDetails);
    });

    it('날짜를 식별자로 해당 저널이 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockJournalRepository.findOne.mockResolvedValue(mockJournal);
      mockInterviewService.findInterview.mockResolvedValue(mockInterview);

      const result = await journalService.getJournalByDate(mockUserInfo, mockDate);

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockInterviewService.findInterview).toHaveBeenCalledWith(mockUser, mockDate);

      expect(mockJournalRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate, deleted_at: null },
      });

      expect(result).toEqual(mockJournalDetails);
    });
  });

  describe('deleteJournal', () => {
    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);

      const result = await journalService.deleteJournal(mockUserInfoExpired, mockDate);

      expect(result).toEqual(mockUserWithMessag);
    });

    it('해당 날짜에 저널이 존재 하지 않으면 NotFoundException을 반환한다. ', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      jest
        .spyOn(journalService, 'getJournalByDateWithoutUserVerify')
        .mockRejectedValue(new NotFoundException());

      await expect(journalService.deleteJournal(mockUserInfo, mockDate)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(journalService.getJournalByDateWithoutUserVerify).toHaveBeenCalledWith(
        mockUser,
        mockDate,
      );
    });
    it('해당 날짜에 저널이 존재 하면 삭제 하고 삭제 완료 메시지를 반환한다', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);

      jest
        .spyOn(journalService, 'getJournalByDateWithoutUserVerify')
        .mockResolvedValue(mockJournal);

      mockJournalRepository.delete.mockResolvedValue(null);

      const result = await journalService.deleteJournal(mockUserInfo, mockDate);

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(journalService.getJournalByDateWithoutUserVerify).toHaveBeenCalledWith(
        mockUser,
        mockDate,
      );
      expect(mockJournalRepository.delete).toHaveBeenCalledWith({
        user: mockUser,
        date: mockDate,
      });
      expect(result).toEqual({
        message: `journal id :${mockJournal.id}, date:${mockJournal.date} removed`,
      });
    });
  });

  describe('updateJournal', () => {
    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);

      const result = await journalService.updateJournal(
        mockUserInfoExpired,
        mockDate,
        mockJournalUpdateDto,
      );

      expect(result).toEqual(mockUserWithMessag);
    });

    it('해당 날짜에 저널이 존재 하지 않으면 NotFoundException을 반환한다. ', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      jest
        .spyOn(journalService, 'getJournalByDateWithoutUserVerify')
        .mockRejectedValue(new NotFoundException());

      await expect(journalService.deleteJournal(mockUserInfo, mockDate)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(journalService.getJournalByDateWithoutUserVerify).toHaveBeenCalledWith(
        mockUser,
        mockDate,
      );
    });

    it('저널을 수정하고 반환한다..', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);

      jest
        .spyOn(journalService, 'getJournalByDateWithoutUserVerify')
        .mockResolvedValueOnce(mockJournal)
        .mockResolvedValueOnce(mockUpdatedJournal);

      const result = await journalService.updateJournal(
        mockUserInfo,
        mockDate,
        mockJournalUpdateDto,
      );

      const updateJournal = {
        title: mockJournalUpdateDto.title,
        keyword: mockJournalUpdateDto.keyword,
        content: mockJournalUpdateDto.content,
        updated_at: new Date(),
      };

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(journalService.getJournalByDateWithoutUserVerify).toHaveBeenCalledWith(
        mockUser,
        mockDate,
      );
      expect(mockJournalRepository.update).toHaveBeenCalledWith(
        { user: mockUser, date: mockDate },
        { ...updateJournal },
      );
      expect(journalService.getJournalByDateWithoutUserVerify).toHaveBeenCalledWith(
        mockUser,
        mockDate,
      );

      expect(result).toEqual(mockUpdatedJournal);
    });
  });

  describe('checkJournalCreationAvailbility', () => {
    const mockDate = {
      date: new Date('2025-01-20'),
    };

    it('당일 저널 생성 횟수를 초과 하면 ConflictException을 반환한다.', async () => {
      await journalService.checkJournalCreationAvailbility(mockUser, mockDate.date);
      const startDate = startOfDay(new Date());
      const endDate = endOfDay(new Date());
      mockJournalCreationRepository.count.mockResolvedValue(3);
      await expect(
        journalService.checkJournalCreationAvailbility(mockUser, mockDate.date),
      ).rejects.toThrow(ConflictException);

      expect(mockJournalCreationRepository.count).toHaveBeenCalledWith({
        where: {
          user: mockUser,
          journal_date: mockDate.date,
          created_at: Between(startDate, endDate),
        },
      });
    });

    it('당일 저널 생성 횟수가 초과 되지 않았다면 메서드를 종료한다.', async () => {
      const startDate = startOfDay(new Date());
      const endDate = endOfDay(new Date());

      mockJournalCreationRepository.count.mockResolvedValue(1);
      await expect(
        journalService.checkJournalCreationAvailbility(mockUser, mockDate.date),
      ).resolves.not.toThrow();

      expect(mockJournalCreationRepository.count).toHaveBeenCalledWith({
        where: {
          user: mockUser,
          journal_date: mockDate.date,
          created_at: Between(startDate, endDate),
        },
      });
    });
  });
});
