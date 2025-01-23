import { Test, TestingModule } from '@nestjs/testing';
import { InitialController } from './initial.controller';
import { UserService } from '../user/user.service';
import { mockUserService } from '../user/mocks/mock.user.service';
import { QuestionService } from '../question/question.service';
import { TimeLimitService } from '../time_limit/time_limit.service';
import { InstructionService } from '../instruction/instruction.service';
import { mockQuestionService } from '../question/mocks/question.service.mock';
import { mockTimeLimitService } from '../time_limit/mocks/timeLimit.service.mock';
import { mockInstructionService } from '../instruction/mocks/instruction.service.mock';
import { BadRequestException } from '@nestjs/common';

describe('InitialController', () => {
  let initialController: InitialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitialController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: TimeLimitService, useValue: mockTimeLimitService },
        { provide: InstructionService, useValue: mockInstructionService },
      ],
    }).compile();

    initialController = module.get<InitialController>(InitialController);
  });

  const mockUuid = 'mock-uuid';
  const mockToken = 'mock-token';
  const mockQuestions = [{ id: 1, content: 'Question 1' }];
  const mockLimits = { id: 1, limit: 60 };
  const mockInstruction = { id: 1, target: 'interview', content: 'Some instructions' };

  describe('createNewUuid', () => {
    it('유저를 생성하고 생성된 유저 객체를 반환한다.', async () => {
      mockUserService.createUser.mockResolvedValue(mockUuid);

      const result = await initialController.createNewUuid();

      expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockUuid);
    });
  });

  describe('sendInitialSetting', () => {
    it('uuid가 누락되면 BadRequestException 을 반환한다.', async () => {
      await expect(initialController.sendInitialSetting(null)).rejects.toThrow(BadRequestException);
    });

    it('초기 세팅 정보를 반환한다.', async () => {
      mockUserService.getUserTocken.mockResolvedValue(mockToken);
      mockQuestionService.getQuestion.mockResolvedValue(mockQuestions);
      mockTimeLimitService.getTimeLimit.mockResolvedValue(mockLimits);
      mockInstructionService.getInstruction.mockResolvedValue(mockInstruction);

      const result = await initialController.sendInitialSetting(mockUuid);

      expect(mockUserService.getUserTocken).toHaveBeenCalledWith(mockUuid);
      expect(mockQuestionService.getQuestion).toHaveBeenCalledTimes(1);
      expect(mockTimeLimitService.getTimeLimit).toHaveBeenCalledTimes(1);
      expect(mockInstructionService.getInstruction).toHaveBeenCalledWith('interview');
      expect(result).toEqual({
        bearer_token: mockToken,
        questions: mockQuestions,
        limits: mockLimits,
        instruction: mockInstruction,
      });
    });
  });
});
