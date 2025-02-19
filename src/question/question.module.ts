import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './entities/question.entity';
import { QuestionController } from './question.controller';
import { CustomQuestionEntity } from './entities/user.custom.question.entity';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';

import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { RedisService } from 'src/otp/redis.service';
import { OAuth2Service } from 'src/otp/oAuth2.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity, CustomQuestionEntity, UserEntity])],
  controllers: [QuestionController],
  providers: [QuestionService, UserService, OtpService, JwtService, RedisService, OAuth2Service],
  exports: [QuestionService],
})
export class QuestionModule {}
