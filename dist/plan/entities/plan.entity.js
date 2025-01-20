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
exports.PlanEntity = void 0;
const purchase_entity_1 = require("../../purchase/entities/purchase.entity");
const typeorm_1 = require("typeorm");
let PlanEntity = class PlanEntity {
};
exports.PlanEntity = PlanEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], PlanEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: false,
    }),
    __metadata("design:type", String)
], PlanEntity.prototype, "plan_name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 6,
        scale: 3,
        default: 0,
        nullable: false,
    }),
    __metadata("design:type", Number)
], PlanEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_entity_1.PurchaseEntity, (purchases) => purchases.plan),
    __metadata("design:type", purchase_entity_1.PurchaseEntity)
], PlanEntity.prototype, "purchases", void 0);
exports.PlanEntity = PlanEntity = __decorate([
    (0, typeorm_1.Entity)('plans')
], PlanEntity);
//# sourceMappingURL=plan.entity.js.map