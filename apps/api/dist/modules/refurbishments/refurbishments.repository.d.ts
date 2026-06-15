import { BaseRepository } from '../../common/repositories/base.repository';
import { RefurbishmentRecord, Prisma } from "@prisma/client";
import { PrismaService } from '../database/prisma.service';
export declare class RefurbishmentsRepository extends BaseRepository<RefurbishmentRecord, Prisma.RefurbishmentRecordCreateInput, Prisma.RefurbishmentRecordUpdateInput> {
    constructor(prisma: PrismaService);
    findByPartnerId(partnerId: string): Promise<RefurbishmentRecord[]>;
}
