import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { User } from "@prisma/client";
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    findAllActive(): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ListingStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        sellerId: string;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        listingType: import(".prisma/client").$Enums.ListingType;
        viewCount: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ListingStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        sellerId: string;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        listingType: import(".prisma/client").$Enums.ListingType;
        viewCount: number;
    }>;
    create(user: User, createListingDto: CreateListingDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ListingStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        sellerId: string;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        listingType: import(".prisma/client").$Enums.ListingType;
        viewCount: number;
    }>;
    remove(id: string): Promise<void>;
}
