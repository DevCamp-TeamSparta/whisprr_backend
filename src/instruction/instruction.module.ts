import { Module } from '@nestjs/common';
import { InstructionService } from './instruction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructionEntity } from './entities/instruction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InstructionEntity])],
  providers: [InstructionService],
})
export class InstructionModule {}
