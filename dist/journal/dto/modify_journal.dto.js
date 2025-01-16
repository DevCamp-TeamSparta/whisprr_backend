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
exports.ModifyJournalDto = void 0;
const class_validator_1 = require("class-validator");
class ModifyJournalDto {
}
exports.ModifyJournalDto = ModifyJournalDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '일기 아이디를 입력해주세요.' }),
    __metadata("design:type", Number)
], ModifyJournalDto.prototype, "journalId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '일기 제목을 입력해주세요' }),
    __metadata("design:type", String)
], ModifyJournalDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({ message: '키워드를 입력해주세요' }),
    __metadata("design:type", Array)
], ModifyJournalDto.prototype, "keyword", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '일기 본문을 입력해주세요.' }),
    __metadata("design:type", String)
], ModifyJournalDto.prototype, "text", void 0);
//# sourceMappingURL=modify_journal.dto.js.map