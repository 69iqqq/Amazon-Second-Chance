import { BaseRepository } from '../../common/repositories/base.repository';
import { Listing, Prisma } from "@prisma/client";
import { PrismaService } from '../database/prisma.service';
export declare class ListingsRepository extends BaseRepository<Listing, Prisma.ListingCreateInput, Prisma.ListingUpdateInput> {
    constructor(prisma: PrismaService);
    findActiveListings(): Promise<Listing[]>;
}
