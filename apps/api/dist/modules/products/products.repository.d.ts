import { BaseRepository } from '../../common/repositories/base.repository';
import { Product, Prisma } from "@prisma/client";
import { PrismaService } from '../database/prisma.service';
export declare class ProductsRepository extends BaseRepository<Product, Prisma.ProductCreateInput, Prisma.ProductUpdateInput> {
    constructor(prisma: PrismaService);
    findByOwner(ownerId: string): Promise<Product[]>;
}
