"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewModule = void 0;
const common_1 = require("@nestjs/common");
const interview_controller_1 = require("./interview.controller");
const interview_service_1 = require("./interview.service");
const user_service_1 = require("../user/user.service");
const typeorm_1 = require("@nestjs/typeorm");
const interview_entity_1 = require("./entities/interview.entity");
const user_entity_1 = require("../user/entities/user.entity");
const jwt_1 = require("@nestjs/jwt");
let InterviewModule = class InterviewModule {
};
exports.InterviewModule = InterviewModule;
exports.InterviewModule = InterviewModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([interview_entity_1.InterviewEntity, user_entity_1.UserEntitiy])],
        controllers: [interview_controller_1.InterviewController],
        providers: [interview_service_1.InterviewService, user_service_1.UserService, jwt_1.JwtService],
    })
], InterviewModule);
//# sourceMappingURL=interview.module.js.map