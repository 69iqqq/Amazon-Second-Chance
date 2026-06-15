import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(ownerId: string, dto: CreateProductDto): Promise<Product> {
    return this.productsRepository.create({
      ...dto,
      owner: { connect: { id: ownerId } },
      category: { connect: { id: dto.categoryId } },
    });
  }

  async findByOwner(ownerId: string): Promise<Product[]> {
    return this.productsRepository.findByOwner(ownerId);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product || product.deletedAt) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async softDelete(id: string): Promise<void> {
    await this.findOne(id); // ensure exists
    await this.productsRepository.softDelete(id);
  }
}
