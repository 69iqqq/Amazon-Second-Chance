import { IsString, IsArray, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReturnDto {
  @ApiProperty({ example: 'uuid-product-id', description: 'ID of the product being returned' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: 'Item arrived damaged with screen cracked', description: 'Customer reason for return' })
  @IsString()
  reason!: string;

  @ApiPropertyOptional({ example: ['s3://bucket/image1.jpg'], description: 'List of media URLs as evidence' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];
}
