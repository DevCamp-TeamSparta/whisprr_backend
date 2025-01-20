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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    findUserInfos(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: {
                    user_id,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        });
    }
    createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = this.userRepository.create({
                user_id: (0, uuid_1.v4)(),
                nickname: '무명',
                created_at: new Date(),
            });
            yield this.userRepository.save(newUser);
            return newUser.user_id;
        });
    }
    changeNickname(uuid, newNickname) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findUserInfos(uuid);
            yield this.userRepository.update({ user_id: uuid }, { nickname: newNickname });
            return yield this.findUserInfos(uuid);
        });
    }
    getUserTocken(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const freeTrialStatus = yield this.checkFreetrial(uuid);
            const planStatus = yield this.checkPlanActive(uuid);
            const payload = { uuid, sub: { uuid, freeTrialStatus, planStatus } };
            const token = this.jwtService.sign(payload);
            return token;
        });
    }
    checkFreetrial(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: { user_id: uuid },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user.trial_status === 'active' ? 'available' : 'non-available';
        });
    }
    checkPlanActive(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: { user_id: uuid },
                relations: ['purchases'],
            });
            console.log(user);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            let hasActivePlan = 'inactive';
            if (user.purchases) {
                hasActivePlan = user.purchases.status;
            }
            return hasActivePlan;
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntitiy)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map