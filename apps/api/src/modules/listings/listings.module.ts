import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { ListingsRepository } from './listings.repository';

@Module({
  controllers: [ListingsController],
  providers: [ListingsService, ListingsRepository],
  exports: [ListingsService],
})
export class ListingsModule {}
