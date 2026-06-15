import { ConfigService } from '@nestjs/config';
export declare class GeminiService {
    private configService;
    private readonly logger;
    private genAI;
    constructor(configService: ConfigService);
    evaluateProductDamage(imageUrls: string[], conditionNotes: string, originalImageUrl?: string): Promise<any>;
}
