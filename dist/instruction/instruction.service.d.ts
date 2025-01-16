import { InstructionEntity } from './entities/instruction.entity';
import { Repository } from 'typeorm';
export declare class InstructionService {
    private instructionRepository;
    constructor(instructionRepository: Repository<InstructionEntity>);
    getInterviewInstruction(): Promise<InstructionEntity>;
}
