import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { ProductGrade, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GradingRepository extends BaseRepository<
  ProductGrade,
  Prisma.ProductGradeCreateInput,
  Prisma.ProductGradeUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'productGrade');
  }

  async findLatestByProductId(productId: string): Promise<ProductGrade | null> {
    return this.model.findFirst({
      where: { productId, isLatest: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsObsolete(productId: string): Promise<void> {
    await this.model.updateMany({
      where: { productId, isLatest: true },
      data: { isLatest: false },
    });
  }
}
