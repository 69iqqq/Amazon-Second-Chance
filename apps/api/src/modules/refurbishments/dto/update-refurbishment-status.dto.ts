import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RefurbishmentStatus } from '@prisma/client';

export class UpdateRefurbishmentStatusDto {
  @ApiProperty({ example: 'COMPLETED', enum: RefurbishmentStatus })
  @IsEnum(RefurbishmentStatus)
  status!: RefurbishmentStatus;
}
