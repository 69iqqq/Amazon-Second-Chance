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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const listings_repository_1 = require("./listings.repository");
let ListingsService = class ListingsService {
    listingsRepository;
    constructor(listingsRepository) {
        this.listingsRepository = listingsRepository;
    }
    async create(sellerId, dto) {
        return this.listingsRepository.create({
            ...dto,
            status: 'ACTIVE',
            viewCount: 0,
            seller: { connect: { id: sellerId } },
            product: { connect: { id: dto.productId } },
        });
    }
    async findAllActive() {
        return this.listingsRepository.findActiveListings();
    }
    async findOne(id) {
        const listing = await this.listingsRepository.findById(id);
        if (!listing || listing.deletedAt) {
            throw new common_1.NotFoundException(`Listing with ID ${id} not found`);
        }
        return listing;
    }
    async softDelete(id) {
        await this.findOne(id);
        await this.listingsRepository.softDelete(id);
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [listings_repository_1.ListingsRepository])
], ListingsService);
