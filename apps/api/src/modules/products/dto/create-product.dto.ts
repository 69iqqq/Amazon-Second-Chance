import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 13 Pro', description: 'The name of the product' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'APP-IP13P-128', description: 'Stock Keeping Unit' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 999.00, description: 'Original purchase price' })
  @IsNumber()
  @Min(0)
  originalPrice!: number;

  @ApiPropertyOptional({ example: 'Apple', description: 'Product Brand' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'iPhone 13 Pro', description: 'Product Model' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: 'uuid-string', description: 'Category ID' })
  @IsUUID()
  categoryId!: string;
}
