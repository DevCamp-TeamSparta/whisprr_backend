import { Module } from '@nestjs/common';
import { InstructionService } from './instruction.service';

@Module({
  providers: [InstructionService]
})
export class InstructionModule {}
