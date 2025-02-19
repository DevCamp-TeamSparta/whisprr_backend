import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanService } from 'src/plan/plan.service';
import { InterviewService } from 'src/interview/interview.service';
import { InstructionService } from 'src/instruction/instruction.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { InterviewEntity } from 'src/interview/entities/interview.entity';
import { InstructionEntity } from 'src/instruction/entities/instruction.entity';
import { JournalService } from 'src/journal/journal.service';
import { JournalEntity } from 'src/journal/entities/journal.entity';
import { JournalCreationEntity } from 'src/journal/entities/journal.creation.entity';
import { OtpService } from 'src/otp/otp.service';
import { RedisService } from 'src/otp/redis.service';
import { OAuth2Service } from 'src/otp/oAuth2.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      PurchaseEntity,
      UserEntity,
      PlanEntity,
      InterviewEntity,
      InstructionEntity,
      JournalEntity,
      JournalCreationEntity,
    ]),
  ],
  controllers: [PurchaseController],
  providers: [
    PurchaseService,
    UserService,
    PlanService,
    InterviewService,
    InstructionService,
    OpenAiService,
    JournalService,
    OtpService,
    RedisService,
    OAuth2Service,
  ],
})
export class PurchaseModule {}
