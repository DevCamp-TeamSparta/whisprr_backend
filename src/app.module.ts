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
import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RestoreModule } from './restore/restore.module';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { UserEntitiy } from './user/entities/user.entity';
import { InterviewEntity } from './interview/entities/interview.entity';
import { JournalEntity } from './journal/entities/journal.entity';
import { QuestionEntity } from './question/entities/question.entity';
import { PurchaseEntity } from './purchase/entities/purchase.entity';
import { PlanEntity } from './plan/entities/plan.entity';
import { TimeLimitEntity } from './time_limit/entities/time_limit.entity';
import { InstructionEntity } from './instruction/entities/instruction.entity';
import { OpenAiService } from './open-ai/open-ai.service';
import { OpenAiModule } from './open-ai/open-ai.module';

const typeOrmModuleOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
      UserEntitiy,
      InterviewEntity,
      JournalEntity,
      QuestionEntity,
      PurchaseEntity,
      PlanEntity,
      TimeLimitEntity,
      InstructionEntity,
    ],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    JournalModule,
    InterviewModule,
    ProfileModule,
    PurchaseModule,
    QuestionModule,
    InstructionModule,
    TimeLimitModule,
    InitialModule,
    RestoreModule,
    UserModule,
    PlanModule,
    OpenAiModule,
  ],
  controllers: [AppController],
  providers: [AppService, OpenAiService],
})
export class AppModule {}
