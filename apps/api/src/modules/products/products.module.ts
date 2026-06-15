import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
