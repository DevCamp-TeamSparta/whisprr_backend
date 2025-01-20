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
exports.JournalController = void 0;
const common_1 = require("@nestjs/common");
const journal_service_1 = require("./journal.service");
const trialAndPlan_guard_1 = require("../common/guards/trialAndPlan.guard");
const user_info_decorator_1 = require("../common/utils/user_info.decorator");
const user_service_1 = require("../user/user.service");
const interview_service_1 = require("../interview/interview.service");
const open_ai_service_1 = require("../open-ai/open-ai.service");
const create_jornal_dto_1 = require("./dto/create_jornal.dto");
const modify_journal_dto_1 = require("./dto/modify_journal.dto");
const user_guard_1 = require("../common/guards/user.guard");
let JournalController = class JournalController {
    constructor(journalService, userService, interviewService, openAiService) {
        this.journalService = journalService;
        this.userService = userService;
        this.interviewService = interviewService;
        this.openAiService = openAiService;
    }
    createJournal(userInfo, jornalDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findUserInfos(userInfo.uuid);
            const interview = yield this.interviewService.findInterview(jornalDto.interviewId);
            const journal = yield this.openAiService.getJournalByAI(interview.content);
            return yield this.journalService.createJournal(user, journal, jornalDto.date);
        });
    }
    getJournalList(userInfo_1, lastDate_1) {
        return __awaiter(this, arguments, void 0, function* (userInfo, lastDate, limit = 5) {
            const user = yield this.userService.findUserInfos(userInfo.uuid);
            const effectiveLastDate = lastDate ? new Date(lastDate) : new Date();
            return yield this.journalService.getJournalList(user, effectiveLastDate, limit);
        });
    }
    getJournal(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findUserInfos(userInfo.uuid);
            return yield this.journalService.getJournal(user, id);
        });
    }
    getJournalByDate(userInfo, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findUserInfos(userInfo.uuid);
            return yield this.journalService.getJournalByDate(user, date);
        });
    }
    deleteJournal(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findUserInfos(userInfo.uuid);
            return yield this.journalService.deleteJournal(user, id);
        });
    }
    updateJournal(userInfo, id, modifyJournalDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findUserInfos(userInfo.uuid);
            return yield this.journalService.updateJournal(user, id, modifyJournalDto);
        });
    }
};
exports.JournalController = JournalController;
__decorate([
    (0, common_1.UseGuards)(trialAndPlan_guard_1.TrialAndPlanGuard),
    (0, common_1.Post)(),
    __param(0, (0, user_info_decorator_1.UserInfo)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_jornal_dto_1.JournalDto]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "createJournal", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)(),
    __param(0, (0, user_info_decorator_1.UserInfo)()),
    __param(1, (0, common_1.Query)('lastDate')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "getJournalList", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)('details/:id'),
    __param(0, (0, user_info_decorator_1.UserInfo)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "getJournal", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)(':date'),
    __param(0, (0, user_info_decorator_1.UserInfo)()),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Date]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "getJournalByDate", null);
__decorate([
    (0, common_1.UseGuards)(trialAndPlan_guard_1.TrialAndPlanGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, user_info_decorator_1.UserInfo)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "deleteJournal", null);
__decorate([
    (0, common_1.UseGuards)(trialAndPlan_guard_1.TrialAndPlanGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, user_info_decorator_1.UserInfo)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, modify_journal_dto_1.ModifyJournalDto]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "updateJournal", null);
exports.JournalController = JournalController = __decorate([
    (0, common_1.Controller)('journal'),
    __metadata("design:paramtypes", [journal_service_1.JournalService,
        user_service_1.UserService,
        interview_service_1.InterviewService,
        open_ai_service_1.OpenAiService])
], JournalController);
//# sourceMappingURL=journal.controller.js.map