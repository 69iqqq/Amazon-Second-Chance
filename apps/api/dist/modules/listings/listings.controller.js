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
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const listings_service_1 = require("./listings.service");
const create_listing_dto_1 = require("./dto/create-listing.dto");
const clerk_auth_guard_1 = require("../../common/guards/clerk-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let ListingsController = class ListingsController {
    listingsService;
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    findAllActive() {
        return this.listingsService.findAllActive();
    }
    findOne(id) {
        return this.listingsService.findOne(id);
    }
    create(user, createListingDto) {
        return this.listingsService.create(user.id, createListingDto);
    }
    remove(id) {
        return this.listingsService.softDelete(id);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Browse active marketplace listings (Public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'View specific listing details (Public)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SELLER, client_1.UserRole.CUSTOMER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new marketplace listing' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_listing_dto_1.CreateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a listing' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "remove", null);
exports.ListingsController = ListingsController = __decorate([
    (0, swagger_1.ApiTags)('Marketplace Listings'),
    (0, common_1.Controller)('listings'),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsController);
