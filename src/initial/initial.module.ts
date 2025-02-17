import { Module } from '@nestjs/common';
import { InitialController } from './initial.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { QuestionEntity } from '../question/entities/question.entity';
import { InstructionEntity } from '../instruction/entities/instruction.entity';
import { UserService } from 'src/user/user.service';
import { QuestionService } from 'src/question/question.service';
import { InstructionService } from 'src/instruction/instruction.service';
import { OtpService } from 'src/otp/otp.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, QuestionEntity, InstructionEntity]),
  ],
  controllers: [InitialController],
  providers: [UserService, QuestionService, InstructionService, UserService, OtpService],
})
export class InitialModule {}
