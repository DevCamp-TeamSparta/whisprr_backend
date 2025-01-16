import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JournalModule } from './journal/journal.module';
import { InterviewModule } from './interview/interview.module';
import { ProfileModule } from './profile/profile.module';
import { PurchaseModule } from './purchase/purchase.module';
import { QuestionModule } from './question/question.module';
import { InstructionModule } from './instruction/instruction.module';
import { TimeLimitModule } from './time_limit/time_limit.module';
import { InitialModule } from './initial/initial.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
    ], // 엔티티 자리!
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};


@Module({
  imports: [JournalModule, InterviewModule, ProfileModule, PurchaseModule, QuestionModule, InstructionModule, TimeLimitModule, InitialModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
