import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { QuestionEntity } from './entities/question.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockQuestionRepository, mockQuestions } from './mocks/question.service.mock';

describe('QuestionService', () => {
  let questionService: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(QuestionEntity),
          useValue: mockQuestionRepository,
        },
      ],
    }).compile();

    questionService = module.get<QuestionService>(QuestionService);
  });

  describe('getInstruction', () => {
    it('intruction을 반환함', async () => {
      mockQuestionRepository.find.mockResolvedValue(mockQuestions);
      const result = await questionService.getQuestion();

      expect(mockQuestionRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockQuestions);
    });
  });
});
