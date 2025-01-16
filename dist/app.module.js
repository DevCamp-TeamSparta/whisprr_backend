"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const journal_module_1 = require("./journal/journal.module");
const interview_module_1 = require("./interview/interview.module");
const profile_module_1 = require("./profile/profile.module");
const purchase_module_1 = require("./purchase/purchase.module");
const question_module_1 = require("./question/question.module");
const instruction_module_1 = require("./instruction/instruction.module");
const time_limit_module_1 = require("./time_limit/time_limit.module");
const initial_module_1 = require("./initial/initial.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const Joi = require("joi");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const restore_module_1 = require("./restore/restore.module");
const user_module_1 = require("./user/user.module");
const plan_module_1 = require("./plan/plan.module");
const user_entity_1 = require("./user/entities/user.entity");
const interview_entity_1 = require("./interview/entities/interview.entity");
const journal_entity_1 = require("./journal/entities/journal.entity");
const question_entity_1 = require("./question/entities/question.entity");
const purchase_entity_1 = require("./purchase/entities/purchase.entity");
const plan_entity_1 = require("./plan/entities/plan.entity");
const time_limit_entity_1 = require("./time_limit/entities/time_limit.entity");
const instruction_entity_1 = require("./instruction/entities/instruction.entity");
const open_ai_service_1 = require("./open-ai/open-ai.service");
const open_ai_module_1 = require("./open-ai/open-ai.module");
const typeOrmModuleOptions = {
    useFactory: (configService) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
            type: 'mysql',
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            database: configService.get('DB_NAME'),
            entities: [
                user_entity_1.UserEntitiy,
                interview_entity_1.InterviewEntity,
                journal_entity_1.JournalEntity,
                question_entity_1.QuestionEntity,
                purchase_entity_1.PurchaseEntity,
                plan_entity_1.PlanEntity,
                time_limit_entity_1.TimeLimitEntity,
                instruction_entity_1.InstructionEntity,
            ],
            synchronize: configService.get('DB_SYNC'),
            logging: true,
        });
    }),
    inject: [config_1.ConfigService],
};
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
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
            typeorm_1.TypeOrmModule.forRootAsync(typeOrmModuleOptions),
            journal_module_1.JournalModule,
            interview_module_1.InterviewModule,
            profile_module_1.ProfileModule,
            purchase_module_1.PurchaseModule,
            question_module_1.QuestionModule,
            instruction_module_1.InstructionModule,
            time_limit_module_1.TimeLimitModule,
            initial_module_1.InitialModule,
            restore_module_1.RestoreModule,
            user_module_1.UserModule,
            plan_module_1.PlanModule,
            open_ai_module_1.OpenAiModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, open_ai_service_1.OpenAiService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map