import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
        id: string;
        clerkId: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        imageUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateLocation(req: any, body: {
        city: string;
        postalCode: string;
    }): Promise<{
        id: string;
        clerkId: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        imageUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(): Promise<{
        id: string;
        clerkId: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        imageUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    suspendUser(id: string): Promise<{
        id: string;
        clerkId: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        imageUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
