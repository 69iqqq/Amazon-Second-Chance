import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from "@prisma/client";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(user: User, createProductDto: CreateProductDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string | null;
        description: string | null;
        brand: string | null;
        categoryId: string | null;
        ownerId: string | null;
        originalPrice: import("@prisma/client/runtime/library").Decimal;
        currentValue: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    findAll(user: User): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string | null;
        description: string | null;
        brand: string | null;
        categoryId: string | null;
        ownerId: string | null;
        originalPrice: import("@prisma/client/runtime/library").Decimal;
        currentValue: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string | null;
        description: string | null;
        brand: string | null;
        categoryId: string | null;
        ownerId: string | null;
        originalPrice: import("@prisma/client/runtime/library").Decimal;
        currentValue: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: string): Promise<void>;
}
