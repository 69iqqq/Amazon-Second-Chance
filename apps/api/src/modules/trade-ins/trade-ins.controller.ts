import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { TradeInsService } from './trade-ins.service';
import { CreateTradeInDto } from './dto/create-trade-in.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Trade-Ins')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('trade-ins')
export class TradeInsController {
  constructor(private readonly tradeInsService: TradeInsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a trade-in request for Green Credits' })
  create(@CurrentUser() user: User, @Body() dto: CreateTradeInDto) {
    return this.tradeInsService.create(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific trade-in request' })
  findOne(@Param('id') id: string) {
    return this.tradeInsService.findOne(id);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve a trade-in (Admin Only)' })
  approve(@Param('id') id: string) {
    return this.tradeInsService.approve(id);
  }
}
