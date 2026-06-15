import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from "@prisma/client";
export declare class ProductsService {
    private readonly productsRepository;
    constructor(productsRepository: ProductsRepository);
    create(ownerId: string, dto: CreateProductDto): Promise<Product>;
    findByOwner(ownerId: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    softDelete(id: string): Promise<void>;
}
