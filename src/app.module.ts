import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JournalModule } from './journal/journal.module';
import { InterviewModule } from './interview/interview.module';
import { ProfileModule } from './profile/profile.module';
import { PurchaseModule } from './purchase/purchase.module';
import { QuestionModule } from './question/question.module';
import { InstructionModule } from './instruction/instruction.module';
import { InitialModule } from './initial/initial.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { UserEntity } from './user/entities/user.entity';
import { InterviewEntity } from './interview/entities/interview.entity';
import { JournalEntity } from './journal/entities/journal.entity';
import { QuestionEntity } from './question/entities/question.entity';
import { PurchaseEntity } from './purchase/entities/purchase.entity';
import { PlanEntity } from './plan/entities/plan.entity';
import { InstructionEntity } from './instruction/entities/instruction.entity';
import { OpenAiService } from './open-ai/open-ai.service';
import { OpenAiModule } from './open-ai/open-ai.module';
import { JournalCreationEntity } from './journal/entities/journal.creation.entity';
import { ReportModule } from './report/report.module';
import { ReportEntity } from './report/entities/report.entity';
import { CustomQuestionEntity } from './question/entities/user.custom.question.entity';
import { OtpService } from './otp/otp.service';

const typeOrmModuleOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
      UserEntity,
      CustomQuestionEntity,
      InterviewEntity,
      JournalEntity,
      QuestionEntity,
      PurchaseEntity,
      PlanEntity,
      InstructionEntity,
      JournalCreationEntity,
      ReportEntity,
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
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
        PACKAGE_NAME: Joi.string().required(),
        YOUR_EMAIL: Joi.string().required(),
        APP_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    JournalModule,
    InterviewModule,
    ProfileModule,
    PurchaseModule,
    QuestionModule,
    InstructionModule,
    InitialModule,
    UserModule,
    PlanModule,
    OpenAiModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService, OpenAiService, OtpService],
})
export class AppModule {}
