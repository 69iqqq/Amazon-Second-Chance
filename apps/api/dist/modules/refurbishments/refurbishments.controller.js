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
exports.RefurbishmentsController = void 0;
const common_1 = require("@nestjs/common");
const refurbishments_service_1 = require("./refurbishments.service");
const create_refurbishment_dto_1 = require("./dto/create-refurbishment.dto");
const update_refurbishment_status_dto_1 = require("./dto/update-refurbishment-status.dto");
const clerk_auth_guard_1 = require("../../common/guards/clerk-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let RefurbishmentsController = class RefurbishmentsController {
    refurbishmentsService;
    constructor(refurbishmentsService) {
        this.refurbishmentsService = refurbishmentsService;
    }
    create(dto) {
        return this.refurbishmentsService.create(dto);
    }
    findOne(id) {
        return this.refurbishmentsService.findOne(id);
    }
    updateStatus(id, dto) {
        return this.refurbishmentsService.updateStatus(id, dto);
    }
};
exports.RefurbishmentsController = RefurbishmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.REFURBISHMENT_CENTER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new refurbishment record' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_refurbishment_dto_1.CreateRefurbishmentDto]),
    __metadata("design:returntype", void 0)
], RefurbishmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific refurbishment record' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RefurbishmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.REFURBISHMENT_CENTER),
    (0, swagger_1.ApiOperation)({ summary: 'Update the status of a refurbishment' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_refurbishment_status_dto_1.UpdateRefurbishmentStatusDto]),
    __metadata("design:returntype", void 0)
], RefurbishmentsController.prototype, "updateStatus", null);
exports.RefurbishmentsController = RefurbishmentsController = __decorate([
    (0, swagger_1.ApiTags)('Refurbishments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    (0, common_1.Controller)('refurbishments'),
    __metadata("design:paramtypes", [refurbishments_service_1.RefurbishmentsService])
], RefurbishmentsController);
