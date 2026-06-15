import { BaseRepository } from '../../common/repositories/base.repository';
import { TradeInRequest, Prisma } from "@prisma/client";
import { PrismaService } from '../database/prisma.service';
export declare class TradeInsRepository extends BaseRepository<TradeInRequest, Prisma.TradeInRequestCreateInput, Prisma.TradeInRequestUpdateInput> {
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<TradeInRequest[]>;
}
