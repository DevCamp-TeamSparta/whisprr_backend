"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLimitModule = void 0;
const common_1 = require("@nestjs/common");
const time_limit_service_1 = require("./time_limit.service");
const time_limit_entity_1 = require("./entities/time_limit.entity");
const typeorm_1 = require("@nestjs/typeorm");
let TimeLimitModule = class TimeLimitModule {
};
exports.TimeLimitModule = TimeLimitModule;
exports.TimeLimitModule = TimeLimitModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([time_limit_entity_1.TimeLimitEntity])],
        providers: [time_limit_service_1.TimeLimitService],
        exports: [time_limit_service_1.TimeLimitService],
    })
], TimeLimitModule);
//# sourceMappingURL=time_limit.module.js.map