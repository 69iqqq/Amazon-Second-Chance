import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Product, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductsRepository extends BaseRepository<
  Product,
  Prisma.ProductCreateInput,
  Prisma.ProductUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'product');
  }

  // Add custom repository methods specific to Products here
  async findByOwner(ownerId: string): Promise<Product[]> {
    return this.model.findMany({
      where: { ownerId, deletedAt: null },
      include: { category: true, images: true, grades: { where: { isLatest: true } } },
    });
  }
}
