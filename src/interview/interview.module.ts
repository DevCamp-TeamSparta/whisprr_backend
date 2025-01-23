import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewEntity } from './entities/interview.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JournalCreationEntity } from '../journal/entities/journal.creation.entity';
import { JournalService } from 'src/journal/journal.service';
import { JournalEntity } from 'src/journal/entities/journal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterviewEntity, UserEntity, JournalCreationEntity, JournalEntity]),
  ],
  controllers: [InterviewController],
  providers: [InterviewService, UserService, JwtService, JournalService],
})
export class InterviewModule {}
