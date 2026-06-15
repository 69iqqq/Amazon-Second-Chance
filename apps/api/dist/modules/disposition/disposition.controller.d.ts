import { DispositionService } from './disposition.service';
import { OverrideDecisionDto } from './dto/override-decision.dto';
import { User } from "@prisma/client";
export declare class DispositionController {
    private readonly dispositionService;
    constructor(dispositionService: DispositionService);
    generateDecision(productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        reason: string | null;
        returnRequestId: string | null;
        decision: import(".prisma/client").$Enums.DispositionType;
        confidence: import("@prisma/client/runtime/library").Decimal;
        isOverridden: boolean;
        overriddenBy: string | null;
        overrideReason: string | null;
    }>;
    getDecision(productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        reason: string | null;
        returnRequestId: string | null;
        decision: import(".prisma/client").$Enums.DispositionType;
        confidence: import("@prisma/client/runtime/library").Decimal;
        isOverridden: boolean;
        overriddenBy: string | null;
        overrideReason: string | null;
    }>;
    overrideDecision(id: string, admin: User, dto: OverrideDecisionDto): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        reason: string | null;
        returnRequestId: string | null;
        decision: import(".prisma/client").$Enums.DispositionType;
        confidence: import("@prisma/client/runtime/library").Decimal;
        isOverridden: boolean;
        overriddenBy: string | null;
        overrideReason: string | null;
    }>;
}
