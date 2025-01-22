import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal.service';
import { LessThan, Repository } from 'typeorm';
import { JournalEntity } from './entities/journal.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockCreatedJournal,
  mockJournal,
  mockJournalList,
  mockJournalRepository,
  mockJournalUpdateDto,
  mockUpdatedJournal,
} from './mocks/journal.service.mock';
import { mockUser, mockUserRepository, mockUserService } from '../user/mocks/mock.user.service';
import { mockJournalByAI } from '../open-ai/mocks/openAI.service.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { mock } from 'node:test';

describe('JournalService', () => {
  let journalService: JournalService;
  let journalRepository: Repository<JournalEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalService,
        JwtService,
        {
          provide: getRepositoryToken(JournalEntity),
          useValue: mockJournalRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    journalService = module.get<JournalService>(JournalService);
    journalRepository = module.get<Repository<JournalEntity>>(getRepositoryToken(JournalEntity));

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-20T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockDate = new Date('2025-01-20');
  describe('createJournal', () => {
    it('해당 날짜에 이미 생성된 저널이 있으면 ConflictException을 반환한다.', async () => {
      mockJournalRepository.findOne.mockResolvedValue(mockJournal);

      await expect(
        journalService.createJournal(mockUser, mockJournalByAI, mockDate),
      ).rejects.toThrow(ConflictException);

      expect(mockJournalRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });
    });

    it('해당 날짜에 중복된 저널이 없으면 저널을 생성하고 반환한다.', async () => {
      mockJournalRepository.findOne.mockResolvedValue(null);
      mockJournalRepository.create.mockReturnValue(mockJournal);
      mockJournalRepository.save.mockResolvedValue(mockJournal);
      mockUserService.findUserInfos.mockResolvedValue(mockUser);
      mockUserService.updateWritingCount.mockResolvedValue(null);

      const result = await journalService.createJournal(mockUser, mockJournalByAI, mockDate);

      expect(mockJournalRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });
      expect(mockJournalRepository.create).toHaveBeenCalledWith(mockCreatedJournal);
      expect(mockJournalRepository.save).toHaveBeenCalledWith(mockJournal);

      expect(result).toEqual(mockJournal);
    });
  });

  describe('getJournalList', () => {
    const mockLastDate = new Date('2025-01-20');
    it('저널 목록을 반환한다.', async () => {
      mockJournalRepository.find.mockResolvedValue(mockJournalList);
      const result = await journalService.getJournalList(mockUser, mockLastDate, 5);
      expect(mockJournalRepository.find).toHaveBeenCalledWith({
        where: {
          user: mockUser,
          date: LessThan(mockLastDate),
          deleted_at: null,
        },
        order: { date: 'DESC' },
        take: 5,
      });

      expect(result).toEqual(mockJournalList);
    });
  });

  describe(' getJournal', () => {
    it('아이디를 식별자로 해당 저널이 없으면 NotfoundException 을 전달한다.', async () => {
      mockJournalRepository.findOne.mockResolvedValue(null);

      await expect(journalService.getJournal(mockUser, 1)).rejects.toThrow(NotFoundException);

      expect(mockJournalRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, id: 1, deleted_at: null },
      });
    });

    it('아이디를 식별자로 해당 저널이 존재하면 반환한다.', async () => {
      mockJournalRepository.findOne.mockResolvedValue(mockJournal);

      const result = await journalService.getJournal(mockUser, 1);

      expect(mockJournalRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, id: 1, deleted_at: null },
      });

      expect(result).toEqual(mockJournal);
    });
  });

  describe('getJournalByDate', () => {
    it('날짜를 식별자로 해당 저널이 없으면 NotfoundException 을 전달한다.', async () => {
      mockJournalRepository.findOne.mockResolvedValue(null);

      await expect(journalService.getJournalByDate(mockUser, mockDate)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockJournalRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate, deleted_at: null },
      });
    });

    it('날짜를 식별자로 해당 저널이 존재하면 반환한다.', async () => {
      mockJournalRepository.findOne.mockResolvedValue(mockJournal);

      const result = await journalService.getJournalByDate(mockUser, mockDate);

      expect(mockJournalRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate, deleted_at: null },
      });

      expect(result).toEqual(mockJournal);
    });
  });

  describe('deleteJournal', () => {
    it('저널을 삭제 하고 삭제 완료 메시지를 반환한다', async () => {
      jest.spyOn(journalService, 'getJournalByDate').mockResolvedValue(mockJournal);
      mockJournalRepository.softDelete.mockResolvedValue(null);

      const result = await journalService.deleteJournal(mockUser, mockDate);

      expect(journalService.getJournalByDate).toHaveBeenCalledWith(mockUser, mockDate);
      expect(mockJournalRepository.softDelete).toHaveBeenCalledWith({
        user: mockUser,
        date: mockDate,
      });
      expect(result).toEqual({
        message: `journal id :${mockJournal.id}, date:${mockJournal.date} removed`,
      });
    });
  });

  describe('updateJournal', () => {
    it('저널을 수정한다.', async () => {
      jest.spyOn(journalService, 'getJournalByDate').mockResolvedValue(mockJournal);
      await journalService.updateJournal(mockUser, mockDate, mockJournalUpdateDto);

      const mockUpdateJournal = {
        title: mockJournalUpdateDto.title,
        keyword: mockJournalUpdateDto.keyword,
        content: mockJournalUpdateDto.content,
        updated_at: new Date(),
      };

      expect(mockJournalRepository.update).toHaveBeenCalledWith(
        { user: mockUser, date: mockDate },
        { ...mockUpdateJournal },
      );
    });
  });
});
