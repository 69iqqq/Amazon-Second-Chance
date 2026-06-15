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
exports.DispositionService = void 0;
const common_1 = require("@nestjs/common");
const disposition_repository_1 = require("./disposition.repository");
const client_1 = require("@prisma/client");
const event_emitter_1 = require("@nestjs/event-emitter");
let DispositionService = class DispositionService {
    dispositionRepository;
    constructor(dispositionRepository) {
        this.dispositionRepository = dispositionRepository;
    }
    async handleGradingCompleted(grade) {
        await this.generateDecision(grade.productId, null);
    }
    async generateDecision(productId, returnRequestId) {
        const mockDecision = await this.dispositionRepository.create({
            product: { connect: { id: productId } },
            decision: client_1.DispositionType.REFURBISH,
            confidence: 94.2,
            reason: 'High resale value after minor screen repair',
            isOverridden: false,
        });
        if (returnRequestId) {
            await this.dispositionRepository.update(mockDecision.id, {
                returnRequest: { connect: { id: returnRequestId } }
            });
        }
        return mockDecision;
    }
    async getLatestDecision(productId) {
        const decisions = await this.dispositionRepository.findByProductId(productId);
        if (decisions.length === 0) {
            throw new common_1.NotFoundException(`No disposition decision found for product ${productId}`);
        }
        return decisions[0];
    }
    async overrideDecision(id, adminId, dto) {
        const decision = await this.dispositionRepository.findById(id);
        if (!decision) {
            throw new common_1.NotFoundException(`Disposition Decision ${id} not found`);
        }
        if (decision.isOverridden) {
            throw new common_1.BadRequestException(`Decision has already been overridden.`);
        }
        return this.dispositionRepository.update(id, {
            decision: dto.newDecision,
            isOverridden: true,
            overriddenBy: adminId,
            overrideReason: dto.reason,
        });
    }
};
exports.DispositionService = DispositionService;
__decorate([
    (0, event_emitter_1.OnEvent)('grading.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DispositionService.prototype, "handleGradingCompleted", null);
exports.DispositionService = DispositionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [disposition_repository_1.DispositionRepository])
], DispositionService);
