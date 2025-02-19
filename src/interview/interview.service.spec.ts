import { Test, TestingModule } from '@nestjs/testing';
import { InterviewService } from './interview.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InterviewEntity } from './entities/interview.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  mockInterview,
  mockInterviewRepository,
  mockUpdateInterviewDto,
} from './mocks/interview.service.mock';

import {
  mockUser,
  mockUserInfo,
  mockUserInfoExpired,
  mockUserService,
  mockUserWithMessag,
} from '../user/mocks/user.service.mock';
import { UserService } from '../user/user.service';
import { JournalService } from '../journal/journal.service';
import { mockJournalService } from '../journal/mocks/journal.service.mock';

describe('InterviewService', () => {
  let interviewService: InterviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewService,
        {
          provide: getRepositoryToken(InterviewEntity),
          useValue: mockInterviewRepository,
        },
        { provide: UserService, useValue: mockUserService },
        { provide: JournalService, useValue: mockJournalService },
      ],
    }).compile();

    interviewService = module.get<InterviewService>(InterviewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockDate = new Date('2025-01-20');

  describe('startInterview', () => {
    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);

      const result = await interviewService.startInterview(mockUserInfoExpired, mockDate);

      expect(result).toEqual(mockUserWithMessag);
    });

    it('해당 날짜에 이미 생성된 저널이 있으면 ConflictException를 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockJournalService.checkJournalExist.mockRejectedValue(new ConflictException());

      await expect(interviewService.startInterview(mockUserInfo, mockDate)).rejects.toThrow(
        ConflictException,
      );

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockJournalService.checkJournalExist).toHaveBeenCalledWith(mockUser, mockDate);
    });

    it('해당 날짜에 같은 날짜의 저널을 3회 이상 생성하면 ConflictException를 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockJournalService.checkJournalExist.mockResolvedValue(null);
      mockJournalService.checkJournalCreationAvailbility.mockRejectedValue(new ConflictException());

      await expect(interviewService.startInterview(mockUserInfo, mockDate)).rejects.toThrow(
        ConflictException,
      );

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockJournalService.checkJournalExist).toHaveBeenCalledWith(mockUser, mockDate);
      expect(mockJournalService.checkJournalCreationAvailbility).toHaveBeenCalledWith(
        mockUser,
        mockDate,
      );
    });

    it('해당 날짜에 이미 생성된 인터뷰 기록이 있으면 해당 인터뷰 기록을 반환한다', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockJournalService.checkJournalExist.mockResolvedValue(null);
      mockJournalService.checkJournalCreationAvailbility.mockResolvedValue(null);
      mockInterviewRepository.findOne.mockResolvedValue(mockInterview);

      const result = await interviewService.startInterview(mockUserInfo, mockDate);

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockJournalService.checkJournalExist).toHaveBeenCalledWith(mockUser, mockDate);
      expect(mockJournalService.checkJournalCreationAvailbility).toHaveBeenCalledWith(
        mockUser,
        mockDate,
      );

      expect(mockInterviewRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });
      expect(result).toEqual(mockInterview);
    });

    it('해당 날짜에 중복된 인터뷰가 없으면 인터뷰 기록을 생성하고 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockJournalService.checkJournalExist.mockResolvedValue(null);
      mockJournalService.checkJournalCreationAvailbility.mockResolvedValue(null);
      mockInterviewRepository.findOne.mockResolvedValue(null);
      mockInterviewRepository.create.mockReturnValue(mockInterview);
      mockInterviewRepository.save.mockResolvedValue(mockInterview);

      const result = await interviewService.startInterview(mockUserInfo, mockDate);

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockJournalService.checkJournalExist).toHaveBeenCalledWith(mockUser, mockDate);
      expect(mockJournalService.checkJournalCreationAvailbility).toHaveBeenCalledWith(
        mockUser,
        mockDate,
      );

      expect(mockInterviewRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });

      expect(mockInterviewRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });
      expect(mockInterviewRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        content: [],
        created_at: expect.any(Date),
        date: mockDate,
      });
      expect(mockInterviewRepository.save).toHaveBeenCalledWith(mockInterview);

      const returnedInterview = {
        content: mockInterview.content,
        date: mockInterview.date,
        question_id: mockInterview.question_id,
        created_at: mockInterview.created_at,
        deleted_at: mockInterview.deleted_at,
      };
      expect(result).toEqual(returnedInterview);
    });
  });

  describe('updateInterview', () => {
    it('user 객체에 토큰 버젼 불일치 메세지가 존재하면 반환한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUserWithMessag);

      const result = await interviewService.startInterview(mockUserInfoExpired, mockDate);

      expect(result).toEqual(mockUserWithMessag);
    });

    it('해당 날짜에 인터뷰 기록이 없다면 NotfoundException을 전달한다.', async () => {
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);
      mockInterviewRepository.findOne.mockResolvedValue(null);

      await expect(
        interviewService.updateInterview(
          mockUserInfo,
          mockDate,
          mockUpdateInterviewDto.interviews,
          mockUpdateInterviewDto.questionId,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockInterviewRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });
      expect(mockInterviewRepository.update).not.toHaveBeenCalled();
    });

    it('인터뷰 기록을 업데이트 하고 업데이트된 인터뷰 내용을 반환한다.', async () => {
      const updatedMockContent = [
        ...mockInterview.content,
        ...mockUpdateInterviewDto.interviews.map((item) => JSON.stringify(item)),
      ];
      mockUserService.findUserByUserInfo.mockResolvedValue(mockUser);

      mockInterviewRepository.findOne
        .mockResolvedValueOnce(mockInterview)
        .mockResolvedValueOnce({ ...mockInterview, content: updatedMockContent, question_id: [1] });

      mockInterviewRepository.update.mockResolvedValue(null);

      const result = await interviewService.updateInterview(
        mockUserInfo,
        mockDate,
        mockUpdateInterviewDto.interviews,
        mockUpdateInterviewDto.questionId,
      );

      expect(mockUserService.findUserByUserInfo).toHaveBeenCalledWith(mockUserInfo);
      expect(mockInterviewRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });

      expect(mockInterviewRepository.update).toHaveBeenCalledWith(
        { date: mockDate },
        { content: updatedMockContent, question_id: [1] },
      );

      expect(result).toEqual({
        ...mockInterview,
        content: updatedMockContent,
        question_id: [1],
      });
    });
  });

  describe('findInterview', () => {
    it('날짜에 해당하는 인터뷰 기록을 반환한다.', async () => {
      mockInterviewRepository.findOne.mockResolvedValue(mockInterview);

      const result = await interviewService.findInterview(mockUser, mockDate);

      expect(mockInterviewRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });
      expect(result).toEqual(mockInterview);
    });

    it('해당날짜에 인터뷰가 존재하지 않으면 Notfoundexception 을 전달한다.', async () => {
      mockInterviewRepository.findOne.mockResolvedValue(null);

      await expect(interviewService.findInterview(mockUser, mockDate)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockInterviewRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });
    });
  });

  describe('resetInterview', () => {
    it('날짜에 해당하는 인터뷰 기록이 있다면 content 를 비우게 업데이트한다.', async () => {
      mockInterviewRepository.update.mockResolvedValue(null);

      const result = await interviewService.resetInterview(mockUser, mockDate);

      expect(mockInterviewRepository.update).toHaveBeenCalledWith(
        { user: mockUser, date: mockDate },
        { content: [], question_id: null },
      );
      expect(result).toEqual(undefined);
    });
  });
});
