import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Returns')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new return request for a product' })
  create(@CurrentUser() user: User, @Body() createReturnDto: CreateReturnDto) {
    return this.returnsService.create(user.id, createReturnDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all return requests submitted by the authenticated user' })
  findAll(@CurrentUser() user: User) {
    return this.returnsService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific return request' })
  findOne(@Param('id') id: string) {
    return this.returnsService.findOne(id);
  }
}
