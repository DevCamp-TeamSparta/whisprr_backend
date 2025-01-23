import { Test, TestingModule } from '@nestjs/testing';
import { InterviewService } from './interview.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InterviewEntity } from './entities/interview.entity';
import { NotFoundException } from '@nestjs/common';
import {
  mockInterview,
  mockInterviewRepository,
  mockUpdateInterviewDto,
} from './mocks/interview.service.mock';
import { Repository } from 'typeorm';
import { mockUser } from '../user/mocks/mock.user.service';

describe('InterviewService', () => {
  let interviewService: InterviewService;
  let interviewRepository: Repository<InterviewEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewService,
        {
          provide: getRepositoryToken(InterviewEntity),
          useValue: mockInterviewRepository,
        },
      ],
    }).compile();

    interviewService = module.get<InterviewService>(InterviewService);
    interviewRepository = module.get<Repository<InterviewEntity>>(
      getRepositoryToken(InterviewEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockDate = new Date('2025-01-20');
  describe('startInterview', () => {
    it('해당 날짜에 이미 생성된 인터뷰 기록이 있으면 해당 인터뷰 기록을 반환한다', async () => {
      mockInterviewRepository.findOne.mockResolvedValue(mockInterview);

      const result = await interviewService.startInterview(mockUser, mockDate);

      expect(mockInterviewRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });
      expect(result).toEqual(mockInterview);
    });

    it('해당 날짜에 중복된 인터뷰가 없으면 인터뷰 기록을 생성하고 반환한다.', async () => {
      mockInterviewRepository.findOne.mockResolvedValue(null);
      mockInterviewRepository.create.mockReturnValue(mockInterview);
      mockInterviewRepository.save.mockResolvedValue(mockInterview);

      const result = await interviewService.startInterview(mockUser, mockDate);

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
      expect(result).toEqual(mockInterview);
    });
  });

  describe('updateInterview', () => {
    it('해당 날짜에 인터뷰 기록이 없다면 NotfoundException을 전달한다.', async () => {
      mockInterviewRepository.findOne.mockResolvedValue(null);

      await expect(
        interviewService.updateInterview(mockUser, mockDate, mockUpdateInterviewDto.interviews),
      ).rejects.toThrow(NotFoundException);

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

      mockInterviewRepository.findOne
        .mockResolvedValueOnce(mockInterview) // 업데이트 이전 데이터
        .mockResolvedValueOnce({ ...mockInterview, content: updatedMockContent }); // 업데이트 이후 데이터

      mockInterviewRepository.update.mockResolvedValue(null);

      const result = await interviewService.updateInterview(
        mockUser,
        mockDate,
        mockUpdateInterviewDto.interviews,
      );

      expect(mockInterviewRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser, date: mockDate },
      });

      expect(mockInterviewRepository.update).toHaveBeenCalledWith(
        { date: mockDate },
        { content: updatedMockContent },
      );

      expect(result).toEqual({
        ...mockInterview,
        content: updatedMockContent,
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
});
