import { mockUser } from '../../user/mocks/mock.user.service';
import { InterviewDto } from '../dto/start.interview.dto';

export const mockInterviewService = {
  startInterview: jest.fn(),
  findInterviewAlready: jest.fn(),
  restartInterview: jest.fn(),
  updateInterview: jest.fn(),
  findInterview: jest.fn(),
};

export const mockInterviewRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
};

export const mockInterview = {
  user: mockUser,
  content: [],
  question_id: null,
  created_at: new Date(),
  date: new Date('2025-01-20'),
  updated_at: null,
  deleted_at: null,
};

export const mockUpdatedInterview = {
  user: mockUser,
  content: [
    {
      question: 'test?',
      answer: 'test',
    },
  ],
  question_id: [1],
  created_at: new Date(),
  date: new Date('0000-00-00'),
  updated_at: new Date(),
  deleted_at: null,
};

export const mockInterviewDto: InterviewDto = {
  date: new Date('2025-01-20'),
};

export const mockUpdateInterviewDto = {
  interviews: [
    {
      question: 'test',
      answer: 'test',
    },
  ],
  questionId: 1,
};
