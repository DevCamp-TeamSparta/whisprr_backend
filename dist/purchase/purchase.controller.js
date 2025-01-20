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
exports.PurchaseController = void 0;
const common_1 = require("@nestjs/common");
const purchase_service_1 = require("./purchase.service");
const user_guard_1 = require("../common/guards/user.guard");
const user_info_decorator_1 = require("../common/utils/user_info.decorator");
const user_service_1 = require("../user/user.service");
const plan_service_1 = require("../plan/plan.service");
let PurchaseController = class PurchaseController {
    constructor(purchaseService, userService, planService) {
        this.purchaseService = purchaseService;
        this.userService = userService;
        this.planService = planService;
    }
    verifyPurchaseToken(userInfo, purchaseToken, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.planService.findPlan(productId);
            const user = yield this.userService.findUserInfos(userInfo.uuid);
            const token = yield this.userService.getUserTocken(user.user_id);
            return Object.assign(Object.assign({}, (yield this.purchaseService.verifyPurchaseToken(plan, user, purchaseToken))), { new_token: token });
        });
    }
    getNotification(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.purchaseService.updatePurchaseTable(message);
            const user = yield this.purchaseService.findUserByPurchaseToken(message.subscriptionNotification.purchaseToken);
            const token = yield this.userService.getUserTocken(user.user_id);
            return token;
        });
    }
};
exports.PurchaseController = PurchaseController;
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)(),
    __param(0, (0, user_info_decorator_1.UserInfo)()),
    __param(1, (0, common_1.Query)('purchaseToken')),
    __param(2, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "verifyPurchaseToken", null);
__decorate([
    (0, common_1.Post)('/pubsub'),
    __param(0, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "getNotification", null);
exports.PurchaseController = PurchaseController = __decorate([
    (0, common_1.Controller)('purchase'),
    __metadata("design:paramtypes", [purchase_service_1.PurchaseService,
        user_service_1.UserService,
        plan_service_1.PlanService])
], PurchaseController);
//# sourceMappingURL=purchase.controller.js.map