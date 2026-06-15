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
exports.CreateReturnDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateReturnDto {
    productId;
    reason;
    mediaUrls;
}
exports.CreateReturnDto = CreateReturnDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-product-id', description: 'ID of the product being returned' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Item arrived damaged with screen cracked', description: 'Customer reason for return' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['s3://bucket/image1.jpg'], description: 'List of media URLs as evidence' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateReturnDto.prototype, "mediaUrls", void 0);
