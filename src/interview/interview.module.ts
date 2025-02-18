import { forwardRef, Module } from '@nestjs/common';
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
import { InstructionService } from 'src/instruction/instruction.service';
import { InstructionEntity } from 'src/instruction/entities/instruction.entity';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { JournalModule } from 'src/journal/journal.module';
import { OtpService } from 'src/otp/otp.service';
import { OAuth2Service } from 'src/otp/oauth2.service';
import { RedisService } from 'src/otp/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterviewEntity,
      UserEntity,
      JournalCreationEntity,
      JournalEntity,
      InstructionEntity,
    ]),
    forwardRef(() => JournalModule),
  ],
  controllers: [InterviewController],
  providers: [
    InterviewService,
    UserService,
    JwtService,
    JournalService,
    InstructionService,
    OpenAiService,
    OtpService,
    OAuth2Service,
    RedisService,
  ],
})
export class InterviewModule {}
