"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialModule = void 0;
const common_1 = require("@nestjs/common");
const initial_controller_1 = require("./initial.controller");
const initial_service_1 = require("./initial.service");
let InitialModule = class InitialModule {
};
exports.InitialModule = InitialModule;
exports.InitialModule = InitialModule = __decorate([
    (0, common_1.Module)({
        controllers: [initial_controller_1.InitialController],
        providers: [initial_service_1.InitialService]
    })
], InitialModule);
//# sourceMappingURL=initial.module.js.map