import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from './plan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { mockPlan, mockPlanRepository } from './mocks/plan.service.mock';

describe('PlanService', () => {
  let planService: PlanService;
  let planRepository: jest.Mocked<Repository<PlanEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        {
          provide: getRepositoryToken(PlanEntity),
          useValue: mockPlanRepository,
        },
      ],
    }).compile();

    planService = module.get<PlanService>(PlanService);
    planRepository = module.get(getRepositoryToken(PlanEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findPlan', () => {
    it('플랜이 존재하지 않으면 NotFoundException을 전달한다.', async () => {
      planRepository.findOne.mockResolvedValue(null);

      await expect(planService.findPlan('non-existent-plan')).rejects.toThrow(NotFoundException);

      expect(planRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-plan' },
      });
    });

    it('플랜이 존재하면 반환한다.', async () => {
      planRepository.findOne.mockResolvedValue(mockPlan);

      const result = await planService.findPlan('test');

      expect(planRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test' },
      });
      expect(result).toEqual(mockPlan);
    });
  });
});
