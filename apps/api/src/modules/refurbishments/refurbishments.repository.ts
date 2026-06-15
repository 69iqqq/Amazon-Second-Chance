import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { RefurbishmentRecord, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RefurbishmentsRepository extends BaseRepository<
  RefurbishmentRecord,
  Prisma.RefurbishmentRecordCreateInput,
  Prisma.RefurbishmentRecordUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'refurbishmentRecord');
  }

  async findByPartnerId(partnerId: string): Promise<RefurbishmentRecord[]> {
    return this.model.findMany({
      where: { partnerId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
