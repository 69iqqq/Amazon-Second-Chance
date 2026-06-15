import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new product to the user\'s inventory' })
  create(@CurrentUser() user: User, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(user.id, createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products owned by the authenticated user' })
  findAll(@CurrentUser() user: User) {
    return this.productsService.findByOwner(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a product' })
  remove(@Param('id') id: string) {
    return this.productsService.softDelete(id);
  }
}
