import { Injectable, NotFoundException } from '@nestjs/common';
import { ListingsRepository } from './listings.repository';
import { CreateListingDto } from './dto/create-listing.dto';
import { Listing } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private readonly listingsRepository: ListingsRepository) {}

  async create(sellerId: string, dto: CreateListingDto): Promise<Listing> {
    return this.listingsRepository.create({
      ...dto,
      status: 'ACTIVE',
      viewCount: 0,
      seller: { connect: { id: sellerId } },
      product: { connect: { id: dto.productId } },
    });
  }

  async findAllActive(): Promise<Listing[]> {
    return this.listingsRepository.findActiveListings();
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingsRepository.findById(id);
    if (!listing || listing.deletedAt) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }
    return listing;
  }

  async softDelete(id: string): Promise<void> {
    await this.findOne(id);
    await this.listingsRepository.softDelete(id);
  }
}
