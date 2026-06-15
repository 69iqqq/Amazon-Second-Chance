import { Module } from '@nestjs/common';
import { GradingService } from './grading.service';
import { GradingController } from './grading.controller';
import { GradingRepository } from './grading.repository';

import { ProductsModule } from '../products/products.module';
import { ExternalServicesModule } from '../../common/external-services.module';

@Module({
  imports: [ProductsModule, ExternalServicesModule],
  controllers: [GradingController],
  providers: [GradingService, GradingRepository],
  exports: [GradingService],
})
export class GradingModule {}
