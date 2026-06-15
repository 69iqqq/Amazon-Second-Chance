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
exports.DispositionController = void 0;
const common_1 = require("@nestjs/common");
const disposition_service_1 = require("./disposition.service");
const override_decision_dto_1 = require("./dto/override-decision.dto");
const clerk_auth_guard_1 = require("../../common/guards/clerk-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let DispositionController = class DispositionController {
    dispositionService;
    constructor(dispositionService) {
        this.dispositionService = dispositionService;
    }
    generateDecision(productId) {
        return this.dispositionService.generateDecision(productId, null);
    }
    getDecision(productId) {
        return this.dispositionService.getLatestDecision(productId);
    }
    overrideDecision(id, admin, dto) {
        return this.dispositionService.overrideDecision(id, admin.id, dto);
    }
};
exports.DispositionController = DispositionController;
__decorate([
    (0, common_1.Post)('disposition/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a new AI disposition decision for a product' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DispositionController.prototype, "generateDecision", null);
__decorate([
    (0, common_1.Get)('disposition/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the latest AI disposition decision for a product' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DispositionController.prototype, "getDecision", null);
__decorate([
    (0, common_1.Post)('admin/decisions/:id/override'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Override an AI disposition decision (Admin Only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, override_decision_dto_1.OverrideDecisionDto]),
    __metadata("design:returntype", void 0)
], DispositionController.prototype, "overrideDecision", null);
exports.DispositionController = DispositionController = __decorate([
    (0, swagger_1.ApiTags)('AI Disposition'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [disposition_service_1.DispositionService])
], DispositionController);
