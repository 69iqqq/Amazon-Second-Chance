import { UsersRepository } from './users.repository';
import { User } from "@prisma/client";
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    getMe(clerkId: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
    suspendUser(id: string): Promise<User>;
    updateLocation(clerkId: string, city: string, postalCode: string): Promise<User>;
}
