import { Controller, Get, Param, Patch, UseGuards, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users & Admin')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('auth/me')
  @ApiOperation({ summary: 'Get the current authenticated user profile' })
  getMe(@Req() req: any) {
    const clerkId = req.user?.clerkId || req.auth?.userId;
    return this.usersService.getMe(clerkId);
  }

  @Patch('auth/me/location')
  @ApiOperation({ summary: 'Update the user location' })
  updateLocation(@Req() req: any, @Body() body: { city: string; postalCode: string }) {
    const clerkId = req.user?.clerkId || req.auth?.userId;
    return this.usersService.updateLocation(clerkId, body.city, body.postalCode);
  }

  @Get('admin/users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List all users (Admin Only)' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Patch('admin/users/:id/suspend')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Suspend a user (Admin Only)' })
  suspendUser(@Param('id') id: string) {
    return this.usersService.suspendUser(id);
  }
}
