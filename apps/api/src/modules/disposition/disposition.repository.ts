import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { DispositionDecision, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DispositionRepository extends BaseRepository<
  DispositionDecision,
  Prisma.DispositionDecisionCreateInput,
  Prisma.DispositionDecisionUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'dispositionDecision');
  }

  async findByProductId(productId: string): Promise<DispositionDecision[]> {
    return this.model.findMany({
      where: { product: { id: productId } }, // Using relation filter
      orderBy: { createdAt: 'desc' },
    });
  }
}
