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
exports.ClerkAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const backend_1 = require("@clerk/backend");
const prisma_service_1 = require("../../modules/database/prisma.service");
const config_1 = require("@nestjs/config");
let ClerkAuthGuard = class ClerkAuthGuard {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing or invalid authentication token');
        }
        const token = authHeader.split(' ')[1];
        const secretKey = this.configService.get('CLERK_SECRET_KEY');
        if (!secretKey) {
            throw new Error('CLERK_SECRET_KEY is not configured');
        }
        try {
            const verifiedToken = await (0, backend_1.verifyToken)(token, {
                secretKey,
            });
            let user = await this.prisma.user.findUnique({
                where: { clerkId: verifiedToken.sub },
            });
            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        clerkId: verifiedToken.sub,
                        email: verifiedToken.email ? verifiedToken.email : `${verifiedToken.sub}@temp.com`,
                        role: 'CUSTOMER',
                        status: 'ACTIVE',
                    },
                });
            }
            if (user.status !== 'ACTIVE') {
                throw new common_1.UnauthorizedException(`User account is ${user.status}`);
            }
            request.user = user;
            request.auth = verifiedToken;
            return true;
        }
        catch (error) {
            console.error('ClerkAuthGuard Error:', error);
            throw new common_1.UnauthorizedException('Invalid authentication token');
        }
    }
};
exports.ClerkAuthGuard = ClerkAuthGuard;
exports.ClerkAuthGuard = ClerkAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ClerkAuthGuard);
