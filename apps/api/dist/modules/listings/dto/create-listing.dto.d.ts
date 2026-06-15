import { ListingType } from "@prisma/client";
export declare class CreateListingDto {
    productId: string;
    title: string;
    description: string;
    price: number;
    listingType: ListingType;
}
