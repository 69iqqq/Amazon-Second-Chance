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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradingController = void 0;
const common_1 = require("@nestjs/common");
const grading_service_1 = require("./grading.service");
const swagger_1 = require("@nestjs/swagger");
let GradingController = class GradingController {
    gradingService;
    constructor(gradingService) {
        this.gradingService = gradingService;
    }
    generateGrade(productId, body) {
        return this.gradingService.generateGrade(productId, body?.imageUrl, body?.conditionNotes, body?.originalImageUrl);
    }
    getProductGrade(productId) {
        return this.gradingService.getProductGrade(productId);
    }
};
exports.GradingController = GradingController;
__decorate([
    (0, common_1.Post)(':productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger AI grading for a product' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GradingController.prototype, "generateGrade", null);
__decorate([
    (0, common_1.Get)(':productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the latest grade for a product' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GradingController.prototype, "getProductGrade", null);
exports.GradingController = GradingController = __decorate([
    (0, swagger_1.ApiTags)('AI Grading'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('grading'),
    __metadata("design:paramtypes", [grading_service_1.GradingService])
], GradingController);
