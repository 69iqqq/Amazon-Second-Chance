import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './modules/database/prisma.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

import { ProductsModule } from './modules/products/products.module';
import { ListingsModule } from './modules/listings/listings.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { GradingModule } from './modules/grading/grading.module';
import { DispositionModule } from './modules/disposition/disposition.module';
import { TradeInsModule } from './modules/trade-ins/trade-ins.module';
import { RefurbishmentsModule } from './modules/refurbishments/refurbishments.module';
import { UsersModule } from './modules/users/users.module';
import { ExternalServicesModule } from './common/external-services.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
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
    EventEmitterModule.forRoot(),
    PrismaModule,
    WebhooksModule,
    ProductsModule,
    ListingsModule,
    ReturnsModule,
    GradingModule,
    DispositionModule,
    TradeInsModule,
    RefurbishmentsModule,
    UsersModule,
    ExternalServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
