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
exports.CreateListingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateListingDto {
    productId;
    title;
    description;
    price;
    listingType;
}
exports.CreateListingDto = CreateListingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-product-id', description: 'Product ID being listed' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Refurbished iPhone 13 Pro', description: 'Title of listing' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Excellent condition, 90% battery health', description: 'Listing description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 750.00, description: 'Selling price' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'P2P_RESALE', enum: client_1.ListingType }),
    (0, class_validator_1.IsEnum)(client_1.ListingType),
    __metadata("design:type", String)
], CreateListingDto.prototype, "listingType", void 0);
