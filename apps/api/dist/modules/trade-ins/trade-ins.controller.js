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
exports.TradeInsController = void 0;
const common_1 = require("@nestjs/common");
const trade_ins_service_1 = require("./trade-ins.service");
const create_trade_in_dto_1 = require("./dto/create-trade-in.dto");
const clerk_auth_guard_1 = require("../../common/guards/clerk-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let TradeInsController = class TradeInsController {
    tradeInsService;
    constructor(tradeInsService) {
        this.tradeInsService = tradeInsService;
    }
    create(user, dto) {
        return this.tradeInsService.create(user.id, dto);
    }
    findOne(id) {
        return this.tradeInsService.findOne(id);
    }
    approve(id) {
        return this.tradeInsService.approve(id);
    }
};
exports.TradeInsController = TradeInsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a trade-in request for Green Credits' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_trade_in_dto_1.CreateTradeInDto]),
    __metadata("design:returntype", void 0)
], TradeInsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific trade-in request' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TradeInsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a trade-in (Admin Only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TradeInsController.prototype, "approve", null);
exports.TradeInsController = TradeInsController = __decorate([
    (0, swagger_1.ApiTags)('Trade-Ins'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    (0, common_1.Controller)('trade-ins'),
    __metadata("design:paramtypes", [trade_ins_service_1.TradeInsService])
], TradeInsController);
