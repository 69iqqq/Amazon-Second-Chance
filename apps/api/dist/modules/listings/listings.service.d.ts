import { ListingsRepository } from './listings.repository';
import { CreateListingDto } from './dto/create-listing.dto';
import { Listing } from "@prisma/client";
export declare class ListingsService {
    private readonly listingsRepository;
    constructor(listingsRepository: ListingsRepository);
    create(sellerId: string, dto: CreateListingDto): Promise<Listing>;
    findAllActive(): Promise<Listing[]>;
    findOne(id: string): Promise<Listing>;
    softDelete(id: string): Promise<void>;
}
