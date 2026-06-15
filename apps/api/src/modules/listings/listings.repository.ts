import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Listing, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ListingsRepository extends BaseRepository<
  Listing,
  Prisma.ListingCreateInput,
  Prisma.ListingUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'listing');
  }

  async findActiveListings(): Promise<Listing[]> {
    return this.model.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      include: { product: true, seller: { select: { firstName: true, lastName: true } } },
    });
  }
}
