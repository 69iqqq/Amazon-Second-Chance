import { TradeInsService } from './trade-ins.service';
import { CreateTradeInDto } from './dto/create-trade-in.dto';
import { User } from "@prisma/client";
export declare class TradeInsController {
    private readonly tradeInsService;
    constructor(tradeInsService: TradeInsService);
    create(user: User, dto: CreateTradeInDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TradeInStatus;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        estimatedValue: import("@prisma/client/runtime/library").Decimal | null;
        finalValue: import("@prisma/client/runtime/library").Decimal | null;
        voucherCode: string | null;
    }>;
    findOne(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TradeInStatus;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        estimatedValue: import("@prisma/client/runtime/library").Decimal | null;
        finalValue: import("@prisma/client/runtime/library").Decimal | null;
        voucherCode: string | null;
    }>;
    approve(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TradeInStatus;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        estimatedValue: import("@prisma/client/runtime/library").Decimal | null;
        finalValue: import("@prisma/client/runtime/library").Decimal | null;
        voucherCode: string | null;
    }>;
}
