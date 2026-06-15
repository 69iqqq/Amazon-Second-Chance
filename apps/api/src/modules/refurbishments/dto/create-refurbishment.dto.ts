import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRefurbishmentDto {
  @ApiProperty({ example: 'uuid-product-id', description: 'Product ID to refurbish' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: 'uuid-partner-id', description: 'Partner center handling refurbishment' })
  @IsUUID()
  partnerId!: string;

  @ApiPropertyOptional({ example: 'Screen replacement required', description: 'Details about the fix' })
  @IsOptional()
  @IsString()
  notes?: string;
}
