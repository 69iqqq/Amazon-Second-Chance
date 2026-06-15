import { Module } from '@nestjs/common';
import { RefurbishmentsService } from './refurbishments.service';
import { RefurbishmentsController } from './refurbishments.controller';
import { RefurbishmentsRepository } from './refurbishments.repository';

@Module({
  controllers: [RefurbishmentsController],
  providers: [RefurbishmentsService, RefurbishmentsRepository],
  exports: [RefurbishmentsService],
})
export class RefurbishmentsModule {}
