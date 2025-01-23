import { Test, TestingModule } from '@nestjs/testing';
import { TimeLimitService } from './time_limit.service';
import { TimeLimitEntity } from './entities/time_limit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockLimits, mockTimeLimitRepository } from './mocks/timeLimit.service.mock';

describe('TimeLimitService', () => {
  let timeLimitservice: TimeLimitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeLimitService,
        {
          provide: getRepositoryToken(TimeLimitEntity),
          useValue: mockTimeLimitRepository,
        },
      ],
    }).compile();

    timeLimitservice = module.get<TimeLimitService>(TimeLimitService);
  });

  describe('getTimeLimit', () => {
    it('timeLimit을 반환함', async () => {
      mockTimeLimitRepository.find.mockResolvedValue(mockLimits);
      const result = await timeLimitservice.getTimeLimit();

      expect(mockTimeLimitRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockLimits);
    });
  });
});
