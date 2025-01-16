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
exports.JournalEntity = void 0;
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let JournalEntity = class JournalEntity {
};
exports.JournalEntity = JournalEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JournalEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: false,
    }),
    __metadata("design:type", String)
], JournalEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: false,
    }),
    __metadata("design:type", Array)
], JournalEntity.prototype, "keyword", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: false }),
    __metadata("design:type", String)
], JournalEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], JournalEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], JournalEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], JournalEntity.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntitiy, (user) => user.journals),
    (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntitiy)
], JournalEntity.prototype, "user", void 0);
exports.JournalEntity = JournalEntity = __decorate([
    (0, typeorm_1.Entity)('journals')
], JournalEntity);
//# sourceMappingURL=journal.entity.js.map