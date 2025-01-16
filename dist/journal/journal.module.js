"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalModule = void 0;
const common_1 = require("@nestjs/common");
const journal_controller_1 = require("./journal.controller");
const journal_service_1 = require("./journal.service");
const jwt_1 = require("@nestjs/jwt");
const journal_entity_1 = require("./entities/journal.entity");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const open_ai_service_1 = require("../open-ai/open-ai.service");
const user_service_1 = require("../user/user.service");
const interview_service_1 = require("../interview/interview.service");
const interview_entity_1 = require("../interview/entities/interview.entity");
let JournalModule = class JournalModule {
};
exports.JournalModule = JournalModule;
exports.JournalModule = JournalModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([journal_entity_1.JournalEntity, user_entity_1.UserEntitiy, interview_entity_1.InterviewEntity])],
        controllers: [journal_controller_1.JournalController],
        providers: [journal_service_1.JournalService, jwt_1.JwtService, open_ai_service_1.OpenAiService, user_service_1.UserService, interview_service_1.InterviewService],
    })
], JournalModule);
//# sourceMappingURL=journal.module.js.map