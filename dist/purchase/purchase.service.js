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
exports.PurchaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const purchase_entity_1 = require("./entities/purchase.entity");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const androidpublisher_1 = require("@googleapis/androidpublisher");
const google_auth_library_1 = require("google-auth-library");
let PurchaseService = class PurchaseService {
    constructor(purchaseRepository, configService) {
        this.purchaseRepository = purchaseRepository;
        this.configService = configService;
    }
    verifyPurchaseToken(productId, purchaseToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyFile = this.configService.get('GOOGLE_KEY_FILE');
            const auth = new google_auth_library_1.GoogleAuth({
                keyFilename: keyFile,
                scopes: ['https://www.googleapis.com/auth/androidpublisher'],
            });
            const getAndroidPublisherClient = () => __awaiter(this, void 0, void 0, function* () {
                const authClient = (yield auth.getClient());
                return (0, androidpublisher_1.androidpublisher)({
                    version: 'v3',
                    auth: authClient,
                });
            });
            const client = yield getAndroidPublisherClient();
            const response = yield client.purchases.subscriptions.get({
                packageName: this.configService.get('PACKAGE_NAME'),
                subscriptionId: productId,
                token: purchaseToken,
            });
            return response.data;
        });
    }
};
exports.PurchaseService = PurchaseService;
exports.PurchaseService = PurchaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_entity_1.PurchaseEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], PurchaseService);
//# sourceMappingURL=purchase.service.js.map