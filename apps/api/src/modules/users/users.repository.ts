import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.model.findUnique({
      where: { clerkId },
      include: {
        profile: true,
        greenCreditWallet: true,
        sustainabilityProfile: true,
      },
    });
  }

  async updateLocation(userId: string, city: string, postalCode: string): Promise<User> {
    return this.model.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: { city, postalCode },
            update: { city, postalCode },
          },
        },
      },
    });
  }
}
