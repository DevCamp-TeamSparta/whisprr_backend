import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { JwtService } from '@nestjs/jwt';
import { JournalEntity } from './entities/journal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { UserService } from 'src/user/user.service';
import { InterviewService } from 'src/interview/interview.service';
import { InterviewEntity } from 'src/interview/entities/interview.entity';
import { InstructionService } from 'src/instruction/instruction.service';
import { InstructionEntity } from 'src/instruction/entities/instruction.entity';
import { JournalCreationEntity } from './entities/journal.creation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JournalEntity,
      UserEntity,
      InterviewEntity,
      InstructionEntity,
      JournalCreationEntity,
    ]),
  ],
  controllers: [JournalController],
  providers: [
    JournalService,
    JwtService,
    OpenAiService,
    UserService,
    InterviewService,
    InstructionService,
  ],
  exports: [JournalService, InterviewService],
})
export class JournalModule {}
