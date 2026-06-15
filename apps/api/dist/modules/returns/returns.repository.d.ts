import { BaseRepository } from '../../common/repositories/base.repository';
import { ReturnRequest, Prisma } from "@prisma/client";
import { PrismaService } from '../database/prisma.service';
export declare class ReturnsRepository extends BaseRepository<ReturnRequest, Prisma.ReturnRequestCreateInput, Prisma.ReturnRequestUpdateInput> {
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<ReturnRequest[]>;
}
