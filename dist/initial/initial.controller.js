"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.InitialController = void 0;
const user_service_1 = require("../user/user.service");
const common_1 = require("@nestjs/common");
const question_service_1 = require("../question/question.service");
const time_limit_service_1 = require("../time_limit/time_limit.service");
const instruction_service_1 = require("../instruction/instruction.service");
let InitialController = class InitialController {
    constructor(userService, questionService, timeLimitService, instructionService) {
        this.userService = userService;
        this.questionService = questionService;
        this.timeLimitService = timeLimitService;
        this.instructionService = instructionService;
    }
    createNewUuid() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.createUser();
        });
    }
    sendInitialSetting(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uuid) {
                throw new Error('UUID is missing in the headers');
            }
            const tocken = yield this.userService.getUserTocken(uuid);
            const questions = yield this.questionService.getQuestion();
            const limits = yield this.timeLimitService.getTimeLimit();
            const instruction = yield this.instructionService.getInterviewInstruction();
            const response = {
                bearer_token: tocken,
                questions,
                limits,
                instruction,
            };
            return response;
        });
    }
};
exports.InitialController = InitialController;
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitialController.prototype, "createNewUuid", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InitialController.prototype, "sendInitialSetting", null);
exports.InitialController = InitialController = __decorate([
    (0, common_1.Controller)('initial'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        question_service_1.QuestionService,
        time_limit_service_1.TimeLimitService,
        instruction_service_1.InstructionService])
], InitialController);
//# sourceMappingURL=initial.controller.js.map