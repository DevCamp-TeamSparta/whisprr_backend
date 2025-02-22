import { forwardRef, Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { JwtService } from '@nestjs/jwt';
import { JournalEntity } from './entities/journal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OpenAiService } from '../open-ai/open-ai.service';
import { UserService } from '../user/user.service';
import { InterviewService } from '../interview/interview.service';
import { InterviewEntity } from '../interview/entities/interview.entity';
import { InstructionService } from '../instruction/instruction.service';
import { InstructionEntity } from '../instruction/entities/instruction.entity';
import { JournalCreationEntity } from './entities/journal.creation.entity';
import { InterviewModule } from 'src/interview/interview.module';
import { OtpService } from 'src/otp/otp.service';
import { RedisService } from 'src/otp/redis.service';
import { OAuth2Service } from 'src/otp/oAuth2.service';
import { OriginalJournalEntity } from './entities/original.jounal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JournalEntity,
      UserEntity,
      InterviewEntity,
      InstructionEntity,
      JournalCreationEntity,
      OriginalJournalEntity,
    ]),
    forwardRef(() => InterviewModule),
  ],
  controllers: [JournalController],
  providers: [
    JournalService,
    JwtService,
    OpenAiService,
    UserService,
    InterviewService,
    InstructionService,
    OtpService,
    RedisService,
    OAuth2Service,
  ],
  exports: [JournalService, InterviewService],
})
export class JournalModule {}
