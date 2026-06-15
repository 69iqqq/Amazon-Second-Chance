"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_module_1 = require("./modules/database/prisma.module");
const webhooks_module_1 = require("./modules/webhooks/webhooks.module");
const products_module_1 = require("./modules/products/products.module");
const listings_module_1 = require("./modules/listings/listings.module");
const returns_module_1 = require("./modules/returns/returns.module");
const grading_module_1 = require("./modules/grading/grading.module");
const disposition_module_1 = require("./modules/disposition/disposition.module");
const trade_ins_module_1 = require("./modules/trade-ins/trade-ins.module");
const refurbishments_module_1 = require("./modules/refurbishments/refurbishments.module");
const users_module_1 = require("./modules/users/users.module");
const external_services_module_1 = require("./common/external-services.module");
const Joi = require("joi");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
                validationSchema: Joi.object({
                    DATABASE_URL: Joi.string().required(),
                    CLERK_SECRET_KEY: Joi.string().required(),
                    CLERK_WEBHOOK_SECRET: Joi.string().required(),
                    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Joi.string().required(),
                    CLOUDINARY_CLOUD_NAME: Joi.string().required(),
                    CLOUDINARY_API_KEY: Joi.string().required(),
                    CLOUDINARY_API_SECRET: Joi.string().required(),
                    GEMINI_API_KEY: Joi.string().required(),
                    PORT: Joi.number().default(3001),
                }),
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            prisma_module_1.PrismaModule,
            webhooks_module_1.WebhooksModule,
            products_module_1.ProductsModule,
            listings_module_1.ListingsModule,
            returns_module_1.ReturnsModule,
            grading_module_1.GradingModule,
            disposition_module_1.DispositionModule,
            trade_ins_module_1.TradeInsModule,
            refurbishments_module_1.RefurbishmentsModule,
            users_module_1.UsersModule,
            external_services_module_1.ExternalServicesModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
