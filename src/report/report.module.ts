import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ReportEntity } from './entities/report.entity';
import { InterviewService } from 'src/interview/interview.service';
import { JournalService } from 'src/journal/journal.service';
import { InterviewEntity } from 'src/interview/entities/interview.entity';
import { JournalEntity } from 'src/journal/entities/journal.entity';
import { JwtService } from '@nestjs/jwt';
import { JournalCreationEntity } from 'src/journal/entities/journal.creation.entity';
import { InstructionService } from 'src/instruction/instruction.service';
import { InstructionEntity } from 'src/instruction/entities/instruction.entity';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { UserModule } from 'src/user/user.module';
import { OtpService } from 'src/otp/otp.service';

import { RedisService } from 'src/otp/redis.service';
import { OAuth2Service } from 'src/otp/oAuth2.service';
import { OriginalJournalEntity } from 'src/journal/entities/original.jounal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ReportEntity,
      InterviewEntity,
      JournalEntity,
      JournalCreationEntity,
      OriginalJournalEntity,
      InstructionEntity,
    ]),
    UserModule,
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    UserService,
    InterviewService,
    JournalService,
    JwtService,
    InstructionService,
    OpenAiService,
    OtpService,
    RedisService,
    OAuth2Service,
  ],
})
export class ReportModule {}
