import { IsString, IsNumber, IsEnum, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ListingType } from '@prisma/client';

export class CreateListingDto {
  @ApiProperty({ example: 'uuid-product-id', description: 'Product ID being listed' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: 'Refurbished iPhone 13 Pro', description: 'Title of listing' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Excellent condition, 90% battery health', description: 'Listing description' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 750.00, description: 'Selling price' })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 'P2P_RESALE', enum: ListingType })
  @IsEnum(ListingType)
  listingType!: ListingType;
}
