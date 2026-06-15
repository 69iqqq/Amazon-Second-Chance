import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { TradeInRequest, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TradeInsRepository extends BaseRepository<
  TradeInRequest,
  Prisma.TradeInRequestCreateInput,
  Prisma.TradeInRequestUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'tradeInRequest');
  }

  async findByUserId(userId: string): Promise<TradeInRequest[]> {
    return this.model.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
