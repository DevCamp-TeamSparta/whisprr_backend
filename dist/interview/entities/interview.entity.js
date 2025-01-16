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
exports.InterviewEntity = void 0;
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let InterviewEntity = class InterviewEntity {
};
exports.InterviewEntity = InterviewEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InterviewEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: false,
    }),
    __metadata("design:type", Array)
], InterviewEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], InterviewEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], InterviewEntity.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntitiy, (user) => user.interviews),
    (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntitiy)
], InterviewEntity.prototype, "user", void 0);
exports.InterviewEntity = InterviewEntity = __decorate([
    (0, typeorm_1.Entity)('interviews')
], InterviewEntity);
//# sourceMappingURL=interview.entity.js.map