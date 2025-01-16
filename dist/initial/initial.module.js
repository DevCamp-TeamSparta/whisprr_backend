"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialModule = void 0;
const common_1 = require("@nestjs/common");
const initial_controller_1 = require("./initial.controller");
const initial_service_1 = require("./initial.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const question_entity_1 = require("../question/entities/question.entity");
const time_limit_entity_1 = require("../time_limit/entities/time_limit.entity");
const instruction_entity_1 = require("../instruction/entities/instruction.entity");
const user_service_1 = require("../user/user.service");
const question_service_1 = require("../question/question.service");
const time_limit_service_1 = require("../time_limit/time_limit.service");
const instruction_service_1 = require("../instruction/instruction.service");
let InitialModule = class InitialModule {
};
exports.InitialModule = InitialModule;
exports.InitialModule = InitialModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET_KEY'),
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntitiy, question_entity_1.QuestionEntity, time_limit_entity_1.TimeLimitEntity, instruction_entity_1.InstructionEntity]),
        ],
        controllers: [initial_controller_1.InitialController],
        providers: [
            initial_service_1.InitialService,
            user_service_1.UserService,
            question_service_1.QuestionService,
            time_limit_service_1.TimeLimitService,
            instruction_service_1.InstructionService,
            user_service_1.UserService,
        ],
    })
], InitialModule);
//# sourceMappingURL=initial.module.js.map