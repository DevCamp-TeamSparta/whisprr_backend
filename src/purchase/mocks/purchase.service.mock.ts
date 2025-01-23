import { mockPlan } from '../../plan/mocks/plan.service.mock';
import { PurchaseEntity } from '../entities/purchase.entity';
import { mockUser } from '../../user/mocks/mock.user.service';
import { PurchaseStatus } from '../utils/purchase.status';

export const mockPurchaseRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
};

export const mockPurchase: PurchaseEntity = {
  id: 1,
  user: mockUser,
  plan: mockPlan,
  purchase_token: 'test',
  status: PurchaseStatus.active,
  purchase_date: new Date('2025-01-20'),
  expiration_date: new Date('2025-02-20'),
};

export const mockPurchaseService = {
  verifyPurchaseToken: jest.fn(),
  updatePurchaseTable: jest.fn(),
  findUserByPurchaseToken: jest.fn(),
};
