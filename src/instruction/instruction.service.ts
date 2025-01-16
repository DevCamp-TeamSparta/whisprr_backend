import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstructionEntity } from './entities/instruction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstructionService {
  constructor(
    @InjectRepository(InstructionEntity)
    private instructionRepository: Repository<InstructionEntity>,
  ) {}
  async getInterviewInstruction() {
    return await this.instructionRepository.findOne({
      where: { target: 'interview' },
    });
  }
}
