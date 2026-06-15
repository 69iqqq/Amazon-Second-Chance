import { Module } from '@nestjs/common';
import { DispositionService } from './disposition.service';
import { DispositionController } from './disposition.controller';
import { DispositionRepository } from './disposition.repository';

@Module({
  controllers: [DispositionController],
  providers: [DispositionService, DispositionRepository],
  exports: [DispositionService],
})
export class DispositionModule {}
