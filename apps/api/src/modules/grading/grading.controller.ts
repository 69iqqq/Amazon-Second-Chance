import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { GradingService } from './grading.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Grading')
@ApiBearerAuth()
@Controller('grading')
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Trigger AI grading for a product' })
  generateGrade(@Param('productId') productId: string, @Body() body?: { imageUrl?: string, conditionNotes?: string, originalImageUrl?: string }) {
    return this.gradingService.generateGrade(productId, body?.imageUrl, body?.conditionNotes, body?.originalImageUrl);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get the latest grade for a product' })
  getProductGrade(@Param('productId') productId: string) {
    return this.gradingService.getProductGrade(productId);
  }
}
