import { BaseRepository } from '../../common/repositories/base.repository';
import { User, Prisma } from "@prisma/client";
import { PrismaService } from '../database/prisma.service';
export declare class UsersRepository extends BaseRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
    constructor(prisma: PrismaService);
    findByClerkId(clerkId: string): Promise<User | null>;
    updateLocation(userId: string, city: string, postalCode: string): Promise<User>;
}
