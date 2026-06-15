import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { User, UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Marketplace Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Browse active marketplace listings (Public)' })
  findAllActive() {
    return this.listingsService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'View specific listing details (Public)' })
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.CUSTOMER) // Customers can do P2P resale
  @ApiOperation({ summary: 'Create a new marketplace listing' })
  create(@CurrentUser() user: User, @Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(user.id, createListingDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Remove a listing' })
  remove(@Param('id') id: string) {
    // Note: Add ownership check in production
    return this.listingsService.softDelete(id);
  }
}
