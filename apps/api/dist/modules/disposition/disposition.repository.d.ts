import { BaseRepository } from '../../common/repositories/base.repository';
import { DispositionDecision, Prisma } from "@prisma/client";
import { PrismaService } from '../database/prisma.service';
export declare class DispositionRepository extends BaseRepository<DispositionDecision, Prisma.DispositionDecisionCreateInput, Prisma.DispositionDecisionUpdateInput> {
    constructor(prisma: PrismaService);
    findByProductId(productId: string): Promise<DispositionDecision[]>;
}
