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
exports.InterviewController = void 0;
const common_1 = require("@nestjs/common");
const interview_service_1 = require("./interview.service");
const user_info_decorator_1 = require("../common/utils/user_info.decorator");
const user_service_1 = require("../user/user.service");
const trialAndPlan_guard_1 = require("../common/guards/trialAndPlan.guard");
const QandAArray_dto_1 = require("./dto/QandAArray.dto");
let InterviewController = class InterviewController {
    constructor(interviewService, userService) {
        this.interviewService = interviewService;
        this.userService = userService;
    }
    startInterview(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findUserInfos(userInfo.uuid);
            return this.interviewService.startInterview(user);
        });
    }
    updateInterview(id, QandADto) {
        return __awaiter(this, void 0, void 0, function* () {
            const QandAs = QandADto.interviews;
            return this.interviewService.updateInterview(id, QandAs);
        });
    }
};
exports.InterviewController = InterviewController;
__decorate([
    (0, common_1.UseGuards)(trialAndPlan_guard_1.TrialAndPlanGuard),
    (0, common_1.Post)(),
    __param(0, (0, user_info_decorator_1.UserInfo)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "startInterview", null);
__decorate([
    (0, common_1.UseGuards)(trialAndPlan_guard_1.TrialAndPlanGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, QandAArray_dto_1.QuestionAnswerArrayDto]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "updateInterview", null);
exports.InterviewController = InterviewController = __decorate([
    (0, common_1.Controller)('interview'),
    __metadata("design:paramtypes", [interview_service_1.InterviewService,
        user_service_1.UserService])
], InterviewController);
//# sourceMappingURL=interview.controller.js.map