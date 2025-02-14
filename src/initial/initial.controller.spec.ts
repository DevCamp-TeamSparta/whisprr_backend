import { Test, TestingModule } from '@nestjs/testing';
import { InitialController } from './initial.controller';
import { UserService } from '../user/user.service';
import { mockUserService } from '../user/mocks/mock.user.service';
import { QuestionService } from '../question/question.service';
import { InstructionService } from '../instruction/instruction.service';
import { mockQuestionService } from '../question/mocks/question.service.mock';
import { mockInstructionService } from '../instruction/mocks/instruction.service.mock';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('InitialController', () => {
  let initialController: InitialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitialController],

      providers: [
        ConfigService,
        { provide: UserService, useValue: mockUserService },
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: InstructionService, useValue: mockInstructionService },
      ],
    }).compile();

    initialController = module.get<InitialController>(InitialController);
  });

  const mockUuid = 'mock-uuid';

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
  });
});
