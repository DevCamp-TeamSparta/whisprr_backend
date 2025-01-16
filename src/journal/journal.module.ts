import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { JwtService } from '@nestjs/jwt';
import { JournalEntity } from './entities/journal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { UserService } from 'src/user/user.service';
import { InterviewService } from 'src/interview/interview.service';
import { InterviewEntity } from 'src/interview/entities/interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntity, UserEntitiy, InterviewEntity])],
  controllers: [JournalController],
  providers: [JournalService, JwtService, OpenAiService, UserService, InterviewService],
})
export class JournalModule {}
