import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { ReturnRequest, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReturnsRepository extends BaseRepository<
  ReturnRequest,
  Prisma.ReturnRequestCreateInput,
  Prisma.ReturnRequestUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'returnRequest');
  }

  async findByUserId(userId: string): Promise<ReturnRequest[]> {
    return this.model.findMany({
      where: { userId },
      include: { product: true, media: true, decisions: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
