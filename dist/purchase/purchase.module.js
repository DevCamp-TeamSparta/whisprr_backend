"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseModule = void 0;
const common_1 = require("@nestjs/common");
const purchase_controller_1 = require("./purchase.controller");
const purchase_service_1 = require("./purchase.service");
const typeorm_1 = require("@nestjs/typeorm");
const purchase_entity_1 = require("./entities/purchase.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../user/entities/user.entity");
const user_service_1 = require("../user/user.service");
const plan_entity_1 = require("../plan/entities/plan.entity");
const plan_service_1 = require("../plan/plan.service");
let PurchaseModule = class PurchaseModule {
};
exports.PurchaseModule = PurchaseModule;
exports.PurchaseModule = PurchaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET_KEY'),
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([purchase_entity_1.PurchaseEntity, user_entity_1.UserEntitiy, plan_entity_1.PlanEntity]),
        ],
        controllers: [purchase_controller_1.PurchaseController],
        providers: [purchase_service_1.PurchaseService, user_service_1.UserService, plan_service_1.PlanService],
    })
], PurchaseModule);
//# sourceMappingURL=purchase.module.js.map