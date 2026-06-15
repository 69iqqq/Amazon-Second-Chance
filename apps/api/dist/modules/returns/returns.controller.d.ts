import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { User } from "@prisma/client";
export declare class ReturnsController {
    private readonly returnsService;
    constructor(returnsService: ReturnsService);
    create(user: User, createReturnDto: CreateReturnDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ReturnStatus;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        reason: string;
        requestedAt: Date;
        approvedAt: Date | null;
        completedAt: Date | null;
    }>;
    findAll(user: User): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ReturnStatus;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        reason: string;
        requestedAt: Date;
        approvedAt: Date | null;
        completedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ReturnStatus;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        reason: string;
        requestedAt: Date;
        approvedAt: Date | null;
        completedAt: Date | null;
    }>;
}
