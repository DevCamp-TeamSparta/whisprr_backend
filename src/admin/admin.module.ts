import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserService } from 'src/user/user.service';
import { ReportService } from 'src/report/report.service';
import { AdminService } from './admin.service';
import { OtpService } from 'src/otp/otp.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Service } from 'src/otp/oAuth2.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { ReportEntity } from 'src/report/entities/report.entity';
import { InterviewService } from 'src/interview/interview.service';
import { JournalService } from 'src/journal/journal.service';
import { RedisService } from 'src/otp/redis.service';
import { InterviewEntity } from 'src/interview/entities/interview.entity';
import { JournalEntity } from 'src/journal/entities/journal.entity';
import { JournalCreationEntity } from 'src/journal/entities/journal.creation.entity';
import { InstructionEntity } from 'src/instruction/entities/instruction.entity';
import { InstructionService } from 'src/instruction/instruction.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { OriginalJournalEntity } from 'src/journal/entities/original.jounal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AdminEntity,
      ReportEntity,
      InterviewEntity,
      JournalEntity,
      JournalCreationEntity,
      OriginalJournalEntity,
      InstructionEntity,
    ]),
    UserModule,
  ],
  controllers: [AdminController],
  providers: [
    UserService,
    ReportService,
    AdminService,
    ConfigService,
    OtpService,
    JwtService,
    RedisService,
    OAuth2Service,
    JournalService,
    InstructionService,
    InterviewService,
    JournalService,
    InstructionService,
    OpenAiService,
  ],
})
export class AdminModule {}
