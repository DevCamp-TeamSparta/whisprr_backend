import { mockPlan } from '../../plan/mocks/plan.service.mock';
import { PurchaseEntity } from '../entities/purchase.entity';
import { mockUser } from '../../user/mocks/user.service.mock';
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
  verifyPurchase: jest.fn(),
  updatePurchaseTable: jest.fn(),
  findUserByPurchaseToken: jest.fn(),
  getUserPlan: jest.fn(),
  reciveRTDN: jest.fn(),
};

export const mockPurchaseToken = 'test-purchase-token';
export const mockVerifyResult = {
  plan: mockPlan,
  purchase_token: mockPurchaseToken,
  purchase_date: '2025-02-05T05:12:17.758Z',
  expiration_date: '2025-02-05T05:17:15.015Z',
  status: 'active',
  new_token: 'new jwt token',
};
