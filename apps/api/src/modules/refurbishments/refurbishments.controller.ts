import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { RefurbishmentsService } from './refurbishments.service';
import { CreateRefurbishmentDto } from './dto/create-refurbishment.dto';
import { UpdateRefurbishmentStatusDto } from './dto/update-refurbishment-status.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Refurbishments')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('refurbishments')
export class RefurbishmentsController {
  constructor(private readonly refurbishmentsService: RefurbishmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.REFURBISHMENT_CENTER)
  @ApiOperation({ summary: 'Create a new refurbishment record' })
  create(@Body() dto: CreateRefurbishmentDto) {
    return this.refurbishmentsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific refurbishment record' })
  findOne(@Param('id') id: string) {
    return this.refurbishmentsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.REFURBISHMENT_CENTER)
  @ApiOperation({ summary: 'Update the status of a refurbishment' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRefurbishmentStatusDto) {
    return this.refurbishmentsService.updateStatus(id, dto);
  }
}
