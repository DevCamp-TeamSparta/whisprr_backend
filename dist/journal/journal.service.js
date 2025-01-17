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
exports.JournalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const journal_entity_1 = require("./entities/journal.entity");
const typeorm_2 = require("typeorm");
let JournalService = class JournalService {
    constructor(journalRepository) {
        this.journalRepository = journalRepository;
    }
    createJournal(user, journal, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const newJournal = this.journalRepository.create({
                user: user,
                title: journal.title,
                keyword: journal.keyword,
                content: journal.content,
                created_at: new Date(),
                date: date,
            });
            yield this.journalRepository.save(newJournal);
            return newJournal;
        });
    }
    getJournalList(user, lastDate, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedDate = new Date(lastDate);
            const journals = yield this.journalRepository.find({
                where: {
                    user: user,
                    date: (0, typeorm_2.LessThan)(parsedDate),
                },
                order: { date: 'DESC' },
                take: limit,
            });
            return journals;
        });
    }
    getJournal(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const journal = yield this.journalRepository.findOne({
                where: {
                    id,
                    user,
                },
            });
            return journal;
        });
    }
    getJournalByDate(user, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const journal = yield this.journalRepository.findOne({
                where: {
                    user,
                    date,
                },
            });
            return journal;
        });
    }
    deleteJournal(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.journalRepository.delete({ user, id });
        });
    }
    updateJournal(user, id, modifyJournalDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateJournal = {
                title: modifyJournalDto.title,
                keyword: modifyJournalDto.keyword,
                content: modifyJournalDto.content,
                updated_at: new Date(),
            };
            yield this.journalRepository.update({ id, user: user }, Object.assign({}, updateJournal));
        });
    }
};
exports.JournalService = JournalService;
exports.JournalService = JournalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(journal_entity_1.JournalEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JournalService);
//# sourceMappingURL=journal.service.js.map