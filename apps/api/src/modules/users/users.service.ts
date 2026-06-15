import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getMe(clerkId: string): Promise<User> {
    const user = await this.usersRepository.findByClerkId(clerkId);
    if (!user) {
      throw new NotFoundException(`User with Clerk ID ${clerkId} not found. Please ensure webhook sync completed.`);
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.findAll({});
  }

  async suspendUser(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found.`);
    }

    return this.usersRepository.update(id, {
      status: UserStatus.BLOCKED,
    } as any);
  }

  async updateLocation(clerkId: string, city: string, postalCode: string): Promise<User> {
    const user = await this.getMe(clerkId);
    await this.usersRepository.updateLocation(user.id, city, postalCode);
    return this.getMe(clerkId);
  }
}
