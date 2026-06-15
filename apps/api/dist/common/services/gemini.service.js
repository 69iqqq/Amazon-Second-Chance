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
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let GeminiService = GeminiService_1 = class GeminiService {
    configService;
    logger = new common_1.Logger(GeminiService_1.name);
    genAI;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new common_1.InternalServerErrorException('GEMINI_API_KEY is not defined');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async evaluateProductDamage(imageUrls, conditionNotes, originalImageUrl) {
        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
            const imageParts = imageUrls.map(url => {
                if (url.startsWith('data:image')) {
                    const matches = url.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
                    if (matches && matches.length === 3) {
                        return {
                            inlineData: {
                                data: matches[2],
                                mimeType: matches[1]
                            }
                        };
                    }
                }
                return null;
            }).filter(Boolean);
            let originalImagePart = null;
            if (originalImageUrl && originalImageUrl.startsWith('http')) {
                try {
                    const res = await fetch(originalImageUrl);
                    const arrayBuffer = await res.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    originalImagePart = {
                        inlineData: {
                            data: buffer.toString('base64'),
                            mimeType: res.headers.get('content-type') || 'image/jpeg'
                        }
                    };
                }
                catch (e) {
                    this.logger.warn(`Failed to fetch original image from ${originalImageUrl} for comparison: ${e}`);
                }
            }
            let prompt = `You are an expert reverse logistics AI evaluator for Amazon 2nd Chance.\n`;
            if (originalImagePart) {
                prompt += `Image 1 is the ORIGINAL Catalog Reference Image from the database.\n`;
                prompt += `Image 2 is the RETURNED Item Image uploaded by the customer.\n`;
                prompt += `CRITICAL: Carefully compare the returned item to the original reference image! Look for deviations, missing accessories, scratches, dents, wear and tear, or pristine condition.\n`;
            }
            else {
                prompt += `Carefully analyze the attached product image(s). Look for scratches, dents, wear and tear, or pristine condition.\n`;
            }
            prompt += `
        Customer condition notes: "${conditionNotes}"
        
        Respond with a JSON object strictly containing:
        {
          "isMismatch": boolean (true ONLY IF the returned item in Image 2 is a completely different product type/model than the original in Image 1),
          "grade": "GRADE_A_PLUS" | "GRADE_A" | "GRADE_B" | "GRADE_C" | "GRADE_D" | "GRADE_F",
          "confidenceScore": number (0-100),
          "estimatedResaleValue": number,
          "damageSummary": "A concise description comparing the original to the return, and visible damage. If it is a mismatch, state that the wrong item was returned."
        }
      `;
            const parts = originalImagePart
                ? [prompt, originalImagePart, ...imageParts]
                : [prompt, ...imageParts];
            const result = await model.generateContent(parts);
            const response = await result.response;
            let text = response.text();
            if (text.startsWith('```json')) {
                text = text.replace('```json', '').replace('```', '').trim();
            }
            return JSON.parse(text);
        }
        catch (error) {
            this.logger.error(`Failed to evaluate product damage: ${error.message}`);
            throw new common_1.InternalServerErrorException('AI Evaluation failed');
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
