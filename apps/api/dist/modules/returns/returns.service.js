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
exports.ReturnsService = void 0;
const common_1 = require("@nestjs/common");
const returns_repository_1 = require("./returns.repository");
const event_emitter_1 = require("@nestjs/event-emitter");
let ReturnsService = class ReturnsService {
    returnsRepository;
    eventEmitter;
    constructor(returnsRepository, eventEmitter) {
        this.returnsRepository = returnsRepository;
        this.eventEmitter = eventEmitter;
    }
    async create(userId, dto) {
        const returnReq = await this.returnsRepository.create({
            reason: dto.reason,
            status: 'REQUESTED',
            user: { connect: { id: userId } },
            product: { connect: { id: dto.productId } },
            media: dto.mediaUrls ? {
                create: dto.mediaUrls.map((url) => ({
                    mediaUrl: url,
                    mediaType: 'IMAGE',
                })),
            } : undefined,
        });
        this.eventEmitter.emit('return.created', returnReq);
        return returnReq;
    }
    async findByUser(userId) {
        return this.returnsRepository.findByUserId(userId);
    }
    async findOne(id) {
        const req = await this.returnsRepository.findById(id);
        if (!req) {
            throw new common_1.NotFoundException(`Return Request with ID ${id} not found`);
        }
        return req;
    }
};
exports.ReturnsService = ReturnsService;
exports.ReturnsService = ReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [returns_repository_1.ReturnsRepository,
        event_emitter_1.EventEmitter2])
], ReturnsService);
