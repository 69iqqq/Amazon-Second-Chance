import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DispositionType } from '@prisma/client';

export class OverrideDecisionDto {
  @ApiProperty({ example: 'DONATE', enum: DispositionType })
  @IsEnum(DispositionType)
  newDecision!: DispositionType;

  @ApiProperty({ example: 'Manual Review determined item can be donated.', description: 'Reason for override' })
  @IsString()
  reason!: string;
}
