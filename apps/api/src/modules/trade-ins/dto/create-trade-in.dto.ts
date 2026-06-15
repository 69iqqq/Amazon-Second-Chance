import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTradeInDto {
  @ApiProperty({ example: 'uuid-product-id', description: 'Product ID being traded in' })
  @IsUUID()
  productId!: string;
}
