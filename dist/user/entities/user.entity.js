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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntitiy = void 0;
const interview_entity_1 = require("../../interview/entities/interview.entity");
const journal_entity_1 = require("../../journal/entities/journal.entity");
const purchase_entity_1 = require("../../purchase/entities/purchase.entity");
const typeorm_1 = require("typeorm");
let UserEntitiy = class UserEntitiy {
};
exports.UserEntitiy = UserEntitiy;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar' }),
    __metadata("design:type", String)
], UserEntitiy.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: false,
        default: '무명',
    }),
    __metadata("design:type", String)
], UserEntitiy.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['active', 'expired'],
        default: 'active',
        nullable: false,
    }),
    __metadata("design:type", String)
], UserEntitiy.prototype, "trial_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, nullable: false }),
    __metadata("design:type", Number)
], UserEntitiy.prototype, "writing_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], UserEntitiy.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UserEntitiy.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => journal_entity_1.JournalEntity, (journals) => journals.user),
    __metadata("design:type", Array)
], UserEntitiy.prototype, "journals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => interview_entity_1.InterviewEntity, (interviews) => interviews.user),
    __metadata("design:type", Array)
], UserEntitiy.prototype, "interviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_entity_1.PurchaseEntity, (purchases) => purchases.user),
    __metadata("design:type", Array)
], UserEntitiy.prototype, "purchases", void 0);
exports.UserEntitiy = UserEntitiy = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntitiy);
//# sourceMappingURL=user.entity.js.map