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
var WebhooksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const webhooks_service_1 = require("./webhooks.service");
const svix_1 = require("svix");
const config_1 = require("@nestjs/config");
let WebhooksController = WebhooksController_1 = class WebhooksController {
    webhooksService;
    configService;
    logger = new common_1.Logger(WebhooksController_1.name);
    constructor(webhooksService, configService) {
        this.webhooksService = webhooksService;
        this.configService = configService;
    }
    async handleWebhook(req, res, svixId, svixTimestamp, svixSignature) {
        if (!svixId || !svixTimestamp || !svixSignature) {
            this.logger.error('Missing svix headers');
            throw new common_1.BadRequestException('Missing svix headers');
        }
        const webhookSecret = this.configService.get('CLERK_WEBHOOK_SECRET');
        if (!webhookSecret) {
            this.logger.error('CLERK_WEBHOOK_SECRET is not configured');
            throw new Error('CLERK_WEBHOOK_SECRET is not configured');
        }
        let payload;
        try {
            const wh = new svix_1.Webhook(webhookSecret);
            const rawBody = req.rawBody ? req.rawBody : JSON.stringify(req.body);
            payload = wh.verify(rawBody, {
                'svix-id': svixId,
                'svix-timestamp': svixTimestamp,
                'svix-signature': svixSignature,
            });
        }
        catch (err) {
            this.logger.error(`Webhook verification failed: ${err.message}`);
            throw new common_1.BadRequestException('Invalid signature');
        }
        const eventType = payload.type;
        this.logger.log(`Received webhook: ${eventType}`);
        switch (eventType) {
            case 'user.created':
                await this.webhooksService.handleUserCreated(payload.data);
                break;
            case 'user.updated':
                await this.webhooksService.handleUserUpdated(payload.data);
                break;
            case 'user.deleted':
                await this.webhooksService.handleUserDeleted(payload.data);
                break;
            default:
                this.logger.warn(`Unhandled webhook event type: ${eventType}`);
        }
        return res.status(200).json({ success: true });
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('svix-id')),
    __param(3, (0, common_1.Headers)('svix-timestamp')),
    __param(4, (0, common_1.Headers)('svix-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleWebhook", null);
exports.WebhooksController = WebhooksController = WebhooksController_1 = __decorate([
    (0, common_1.Controller)('webhooks/clerk'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService,
        config_1.ConfigService])
], WebhooksController);
