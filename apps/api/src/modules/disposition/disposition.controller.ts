import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DispositionService } from './disposition.service';
import { OverrideDecisionDto } from './dto/override-decision.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Disposition')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller()
export class DispositionController {
  constructor(private readonly dispositionService: DispositionService) {}

  @Post('disposition/:productId')
  @ApiOperation({ summary: 'Generate a new AI disposition decision for a product' })
  generateDecision(@Param('productId') productId: string) {
    return this.dispositionService.generateDecision(productId, null);
  }

  @Get('disposition/:productId')
  @ApiOperation({ summary: 'Get the latest AI disposition decision for a product' })
  getDecision(@Param('productId') productId: string) {
    return this.dispositionService.getLatestDecision(productId);
  }

  @Post('admin/decisions/:id/override')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Override an AI disposition decision (Admin Only)' })
  overrideDecision(
    @Param('id') id: string,
    @CurrentUser() admin: User,
    @Body() dto: OverrideDecisionDto,
  ) {
    return this.dispositionService.overrideDecision(id, admin.id, dto);
  }
}
