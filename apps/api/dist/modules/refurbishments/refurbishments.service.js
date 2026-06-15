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
exports.RefurbishmentsService = void 0;
const common_1 = require("@nestjs/common");
const refurbishments_repository_1 = require("./refurbishments.repository");
let RefurbishmentsService = class RefurbishmentsService {
    refurbishmentsRepository;
    constructor(refurbishmentsRepository) {
        this.refurbishmentsRepository = refurbishmentsRepository;
    }
    async create(dto) {
        return this.refurbishmentsRepository.create({
            status: 'PENDING',
            product: { connect: { id: dto.productId } },
            partner: { connect: { id: dto.partnerId } },
        });
    }
    async findOne(id) {
        const record = await this.refurbishmentsRepository.findById(id);
        if (!record) {
            throw new common_1.NotFoundException(`Refurbishment record ${id} not found`);
        }
        return record;
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        const updateData = { status: dto.status };
        if (dto.status === 'COMPLETED') {
            updateData.completedAt = new Date();
        }
        return this.refurbishmentsRepository.update(id, updateData);
    }
};
exports.RefurbishmentsService = RefurbishmentsService;
exports.RefurbishmentsService = RefurbishmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [refurbishments_repository_1.RefurbishmentsRepository])
], RefurbishmentsService);
