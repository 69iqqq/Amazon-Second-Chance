import { Module } from '@nestjs/common';
import { TradeInsService } from './trade-ins.service';
import { TradeInsController } from './trade-ins.controller';
import { TradeInsRepository } from './trade-ins.repository';

@Module({
  controllers: [TradeInsController],
  providers: [TradeInsService, TradeInsRepository],
  exports: [TradeInsService],
})
export class TradeInsModule {}
