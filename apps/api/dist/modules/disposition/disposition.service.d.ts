import { DispositionRepository } from './disposition.repository';
import { OverrideDecisionDto } from './dto/override-decision.dto';
import { DispositionDecision, ProductGrade } from "@prisma/client";
export declare class DispositionService {
    private readonly dispositionRepository;
    constructor(dispositionRepository: DispositionRepository);
    handleGradingCompleted(grade: ProductGrade): Promise<void>;
    generateDecision(productId: string, returnRequestId: string | null): Promise<DispositionDecision>;
    getLatestDecision(productId: string): Promise<DispositionDecision>;
    overrideDecision(id: string, adminId: string, dto: OverrideDecisionDto): Promise<DispositionDecision>;
}
