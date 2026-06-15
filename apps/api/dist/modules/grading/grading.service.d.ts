import { GradingRepository } from './grading.repository';
import { ProductsService } from '../products/products.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GeminiService } from '../../common/services/gemini.service';
import { ProductGrade } from "@prisma/client";
export declare class GradingService {
    private readonly gradingRepository;
    private readonly productsService;
    private readonly eventEmitter;
    private readonly geminiService;
    constructor(gradingRepository: GradingRepository, productsService: ProductsService, eventEmitter: EventEmitter2, geminiService: GeminiService);
    generateGrade(productId: string, imageUrl?: string, condition?: string, originalImageUrl?: string): Promise<ProductGrade>;
    getProductGrade(productId: string): Promise<ProductGrade>;
}
