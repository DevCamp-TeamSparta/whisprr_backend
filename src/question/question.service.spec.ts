import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { QuestionEntity } from './entities/question.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockQuestionRepository, mockQuestions } from './mocks/question.service.mock';
import { Repository } from 'typeorm';

describe('QuestionService', () => {
  let questionService: QuestionService;
  let questionRepository: Repository<QuestionEntity>;

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
    questionRepository = module.get<Repository<QuestionEntity>>(getRepositoryToken(QuestionEntity));
  });

  describe('getInstruction', () => {
    it('intruction을 반환함', async () => {
      const mockTarget = 'interview';

      mockQuestionRepository.find.mockResolvedValue(mockQuestions);
      const result = await questionService.getQuestion();

      expect(mockQuestionRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockQuestions);
    });
  });
});
