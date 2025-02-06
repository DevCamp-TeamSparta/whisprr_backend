import { mockUser } from '../../user/mocks/mock.user.service';
import { JournalEntity } from '../entities/journal.entity';
import { JournalDto } from '../dto/create_jornal.dto';
import { ModifyJournalDto } from '../dto/modify_journal.dto';
import { JournalCreationEntity } from '../entities/journal.creation.entity';

export const mockJournalService = {
  createJournal: jest.fn(),
  getJournalList: jest.fn(),
  getJournal: jest.fn(),
  getJournalByDate: jest.fn(),
  deleteJournal: jest.fn(),
  updateJournal: jest.fn(),
  checkJournalCreationAvailbility: jest.fn(),
  checkJournalExist: jest.fn(),
};

export const mockJournalRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
};

export const mockJournal: JournalEntity = {
  id: 1,
  user: mockUser,
  title: 'test',
  keyword: ['test'],
  content: 'test',
  date: new Date('2025-01-20'),
  created_at: new Date('2025-01-20T00:00:00.000Z'),
  updated_at: null,
  deleted_at: null,
};

export const mockCreatedJournal = {
  title: 'test',
  keyword: ['test'],
  content: 'test',
  created_at: new Date('2025-01-20T00:00:00.000Z'),
  date: new Date('2025-01-20'),
  user: mockUser,
};

export const mockJournalList: JournalEntity[] = [
  {
    id: 1,
    user: mockUser,
    title: 'text',
    keyword: ['text'],
    content: 'text',
    date: new Date('2025-01-20'),
    created_at: new Date('2025-01-20T00:00:00.000Z'),
    updated_at: null,
    deleted_at: null,
  },
];

export const mockJournalDto: JournalDto = {
  date: new Date('2025-01-20'),
};

export const mockJournalUpdateDto: ModifyJournalDto = {
  title: 'text1',
  keyword: ['text1'],
  content: 'text1',
};

export const mockUpdatedJournal: JournalEntity = {
  id: 1,
  user: mockUser,
  title: 'test',
  keyword: ['test'],
  content: 'test',
  date: new Date('2025-01-20'),
  created_at: new Date('2025-01-20T00:00:00.000Z'),
  updated_at: new Date('2025-01-23T02:42:37.574Z'),
  deleted_at: null,
};

export const mockJournalCreation: JournalCreationEntity = {
  id: 1,
  user: mockUser,
  journal_date: new Date('2025-01-20'),
  created_at: new Date(),
};

export const mockJournalCreationRepository = {
  count: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

export const mockJournalDetails = {
  journalData: mockJournal,
  questionIds: null,
  message: undefined,
};
