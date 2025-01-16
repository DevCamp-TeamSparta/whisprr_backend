import { Module } from '@nestjs/common';
import { InitialController } from './initial.controller';
import { InitialService } from './initial.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntitiy } from '../user/entities/user.entity';
import { QuestionEntity } from '../question/entities/question.entity';
import { TimeLimitEntity } from '../time_limit/entities/time_limit.entity';
import { InstructionEntity } from '../instruction/entities/instruction.entity';
import { UserService } from 'src/user/user.service';
import { QuestionService } from 'src/question/question.service';
import { TimeLimitService } from 'src/time_limit/time_limit.service';
import { InstructionService } from 'src/instruction/instruction.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntitiy, QuestionEntity, TimeLimitEntity, InstructionEntity]),
  ],
  controllers: [InitialController],
  providers: [
    InitialService,
    UserService,
    QuestionService,
    TimeLimitService,
    InstructionService,
    UserService,
  ],
})
export class InitialModule {}
