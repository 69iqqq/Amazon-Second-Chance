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
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    prisma;
    logger = new common_1.Logger(WebhooksService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleUserCreated(payload) {
        const { id, email_addresses, first_name, last_name, image_url } = payload;
        const primaryEmail = email_addresses.find((email) => email.id === payload.primary_email_address_id)?.email_address;
        this.logger.log(`Handling user.created for Clerk ID: ${id}`);
        try {
            await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        clerkId: id,
                        email: primaryEmail,
                        firstName: first_name,
                        lastName: last_name,
                        imageUrl: image_url,
                        role: 'CUSTOMER',
                        status: 'ACTIVE',
                    },
                });
                await tx.greenCreditWallet.create({
                    data: {
                        userId: user.id,
                        balance: 0,
                        lifetimeEarned: 0,
                        lifetimeRedeemed: 0,
                    },
                });
                await tx.sustainabilityProfile.create({
                    data: {
                        userId: user.id,
                        co2Saved: 0,
                        productsReused: 0,
                        productsRecycled: 0,
                        donationsMade: 0,
                        sustainabilityScore: 0,
                    },
                });
                this.logger.log(`Successfully synced new user ${user.id} and initialized profiles.`);
            });
        }
        catch (error) {
            this.logger.error(`Failed to handle user.created: ${error.message}`);
            throw error;
        }
    }
    async handleUserUpdated(payload) {
        const { id, email_addresses, first_name, last_name, image_url } = payload;
        const primaryEmail = email_addresses.find((email) => email.id === payload.primary_email_address_id)?.email_address;
        this.logger.log(`Handling user.updated for Clerk ID: ${id}`);
        try {
            await this.prisma.user.update({
                where: { clerkId: id },
                data: {
                    email: primaryEmail,
                    firstName: first_name,
                    lastName: last_name,
                    imageUrl: image_url,
                },
            });
            this.logger.log(`Successfully updated user with Clerk ID: ${id}`);
        }
        catch (error) {
            this.logger.error(`Failed to handle user.updated: ${error.message}`);
            throw error;
        }
    }
    async handleUserDeleted(payload) {
        const { id } = payload;
        this.logger.log(`Handling user.deleted for Clerk ID: ${id}`);
        try {
            await this.prisma.user.update({
                where: { clerkId: id },
                data: {
                    status: 'INACTIVE',
                    deletedAt: new Date(),
                },
            });
            this.logger.log(`Soft-deleted user with Clerk ID: ${id}`);
        }
        catch (error) {
            this.logger.error(`Failed to handle user.deleted: ${error.message}`);
            throw error;
        }
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhooksService);
