import { RefurbishmentsService } from './refurbishments.service';
import { CreateRefurbishmentDto } from './dto/create-refurbishment.dto';
import { UpdateRefurbishmentStatusDto } from './dto/update-refurbishment-status.dto';
export declare class RefurbishmentsController {
    private readonly refurbishmentsService;
    constructor(refurbishmentsService: RefurbishmentsService);
    create(dto: CreateRefurbishmentDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.RefurbishmentStatus;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        completedAt: Date | null;
        partnerId: string;
        repairCost: import("@prisma/client/runtime/library").Decimal | null;
        inspectionReport: string | null;
        startedAt: Date | null;
    }>;
    findOne(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.RefurbishmentStatus;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        completedAt: Date | null;
        partnerId: string;
        repairCost: import("@prisma/client/runtime/library").Decimal | null;
        inspectionReport: string | null;
        startedAt: Date | null;
    }>;
    updateStatus(id: string, dto: UpdateRefurbishmentStatusDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.RefurbishmentStatus;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        completedAt: Date | null;
        partnerId: string;
        repairCost: import("@prisma/client/runtime/library").Decimal | null;
        inspectionReport: string | null;
        startedAt: Date | null;
    }>;
}
