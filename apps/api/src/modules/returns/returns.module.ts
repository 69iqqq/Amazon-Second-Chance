import { Module } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { ReturnsRepository } from './returns.repository';

@Module({
  controllers: [ReturnsController],
  providers: [ReturnsService, ReturnsRepository],
  exports: [ReturnsService],
})
export class ReturnsModule {}
