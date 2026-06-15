import { BaseRepository } from '../../common/repositories/base.repository';
import { ProductGrade, Prisma } from "@prisma/client";
import { PrismaService } from '../database/prisma.service';
export declare class GradingRepository extends BaseRepository<ProductGrade, Prisma.ProductGradeCreateInput, Prisma.ProductGradeUpdateInput> {
    constructor(prisma: PrismaService);
    findLatestByProductId(productId: string): Promise<ProductGrade | null>;
    markAsObsolete(productId: string): Promise<void>;
}
