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
exports.OpenAiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const zod_1 = require("openai/helpers/zod");
const zod_2 = require("zod");
const config_1 = require("@nestjs/config");
let OpenAiService = class OpenAiService {
    constructor(configService) {
        this.configService = configService;
    }
    getJournalByAI(interview) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = this.configService.get('OPENAI_API_KEY');
            const openai = new openai_1.default({ apiKey });
            const CalendarEvent = zod_2.z.object({
                title: zod_2.z.string(),
                keyword: zod_2.z.array(zod_2.z.string()),
                content: zod_2.z.string(),
            });
            const completion = yield openai.beta.chat.completions.parse({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'write a journal, based on user interview, The journal should have  1 paragraph',
                    },
                    {
                        role: 'user',
                        content: `${interview}`,
                    },
                ],
                response_format: (0, zod_1.zodResponseFormat)(CalendarEvent, 'event'),
            });
            const event = completion.choices[0].message.parsed;
            return event;
        });
    }
};
exports.OpenAiService = OpenAiService;
exports.OpenAiService = OpenAiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenAiService);
//# sourceMappingURL=open-ai.service.js.map