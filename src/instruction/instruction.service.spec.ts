import { Test, TestingModule } from '@nestjs/testing';
import { InstructionService } from './instruction.service';
import { mockInstruction, mockInstructionRepository } from './mocks/instruction.service.mock';
import { Repository } from 'typeorm';
import { InstructionEntity } from './entities/instruction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('InstructionService', () => {
  let instructionservice: InstructionService;
  let instructionRepository: Repository<InstructionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstructionService,
        {
          provide: getRepositoryToken(InstructionEntity),
          useValue: mockInstructionRepository,
        },
      ],
    }).compile();

    instructionservice = module.get<InstructionService>(InstructionService);
    instructionRepository = module.get<Repository<InstructionEntity>>(
      getRepositoryToken(InstructionEntity),
    );
  });

  describe('getInstruction', () => {
    it('intruction을 반환함', async () => {
      const mockTarget = 'interview';

      mockInstructionRepository.findOne.mockResolvedValue(mockInstruction);
      const result = await instructionservice.getInstruction(mockTarget);

      expect(mockInstructionRepository.findOne).toHaveBeenCalledWith({
        where: { target: mockTarget },
      });
      expect(result).toEqual(mockInstruction);
    });
  });
});
