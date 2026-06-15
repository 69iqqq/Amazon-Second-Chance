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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async getMe(clerkId) {
        const user = await this.usersRepository.findByClerkId(clerkId);
        if (!user) {
            throw new common_1.NotFoundException(`User with Clerk ID ${clerkId} not found. Please ensure webhook sync completed.`);
        }
        return user;
    }
    async getAllUsers() {
        return this.usersRepository.findAll({});
    }
    async suspendUser(id) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User ${id} not found.`);
        }
        return this.usersRepository.update(id, {
            status: client_1.UserStatus.BLOCKED,
        });
    }
    async updateLocation(clerkId, city, postalCode) {
        const user = await this.getMe(clerkId);
        await this.usersRepository.updateLocation(user.id, city, postalCode);
        return this.getMe(clerkId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
