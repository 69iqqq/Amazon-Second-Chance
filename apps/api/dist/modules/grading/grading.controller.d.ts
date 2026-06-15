import { GradingService } from './grading.service';
export declare class GradingController {
    private readonly gradingService;
    constructor(gradingService: GradingService);
    generateGrade(productId: string, body?: {
        imageUrl?: string;
        conditionNotes?: string;
        originalImageUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        grade: import(".prisma/client").$Enums.ProductGradeValue;
        confidenceScore: import("@prisma/client/runtime/library").Decimal;
        damageSummary: string | null;
        gradedBy: string;
        isLatest: boolean;
    }>;
    getProductGrade(productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        grade: import(".prisma/client").$Enums.ProductGradeValue;
        confidenceScore: import("@prisma/client/runtime/library").Decimal;
        damageSummary: string | null;
        gradedBy: string;
        isLatest: boolean;
    }>;
}
