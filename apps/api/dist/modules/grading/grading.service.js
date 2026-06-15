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
exports.GradingService = void 0;
const common_1 = require("@nestjs/common");
const grading_repository_1 = require("./grading.repository");
const products_service_1 = require("../products/products.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const gemini_service_1 = require("../../common/services/gemini.service");
const client_1 = require("@prisma/client");
let GradingService = class GradingService {
    gradingRepository;
    productsService;
    eventEmitter;
    geminiService;
    constructor(gradingRepository, productsService, eventEmitter, geminiService) {
        this.gradingRepository = gradingRepository;
        this.productsService = productsService;
        this.eventEmitter = eventEmitter;
        this.geminiService = geminiService;
    }
    async generateGrade(productId, imageUrl, condition, originalImageUrl) {
        const product = await this.productsService.findOne(productId);
        const conditionNotes = condition || "Customer stated screen has minor scratches, battery holds charge.";
        const imageUrls = imageUrl ? [imageUrl] : ['https://example.com/product_image.jpg'];
        let aiResult;
        try {
            aiResult = await this.geminiService.evaluateProductDamage(imageUrls, conditionNotes, originalImageUrl);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('AI evaluation engine is currently unavailable');
        }
        const mappedGradeValue = aiResult.grade || client_1.ProductGradeValue.GRADE_C;
        const grade = await this.gradingRepository.create({
            grade: mappedGradeValue,
            confidenceScore: aiResult.confidenceScore || 85,
            damageSummary: aiResult.damageSummary || 'Standard wear and tear',
            product: { connect: { id: productId } },
            gradedBy: 'GEMINI_AI',
        });
        this.eventEmitter.emit('grading.completed', {
            productId,
            gradeId: grade.id,
            gradeValue: grade.grade,
        });
        return {
            ...grade,
            isMismatch: aiResult.isMismatch || false
        };
    }
    async getProductGrade(productId) {
        const grades = await this.gradingRepository.findAll({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            take: 1,
        });
        if (!grades.length) {
            throw new common_1.NotFoundException(`No grades found for product ${productId}`);
        }
        return grades[0];
    }
};
exports.GradingService = GradingService;
exports.GradingService = GradingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [grading_repository_1.GradingRepository,
        products_service_1.ProductsService,
        event_emitter_1.EventEmitter2,
        gemini_service_1.GeminiService])
], GradingService);
