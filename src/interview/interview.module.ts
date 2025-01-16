import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewEntity } from './entities/interview.entity';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewEntity, UserEntitiy])],
  controllers: [InterviewController],
  providers: [InterviewService, UserService, JwtService],
})
export class InterviewModule {}
