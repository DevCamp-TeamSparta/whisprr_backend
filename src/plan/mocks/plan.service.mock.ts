import { PlanEntity } from '../entities/plan.entity';

export const mockPlanRepository = {
  findOne: jest.fn(),
};

export const mockPlan: PlanEntity = {
  id: 'test',
  plan_name: 'Basic Plan',
  price: 10,
  purchases: null,
};

export const mockPlanService = {
  findPlan: jest.fn(),
};
