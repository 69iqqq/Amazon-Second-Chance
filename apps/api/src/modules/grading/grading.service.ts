import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GradingRepository } from './grading.repository';
import { ProductsService } from '../products/products.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GeminiService } from '../../common/services/gemini.service';
import { ProductGrade, ProductGradeValue } from '@prisma/client';

@Injectable()
export class GradingService {
  constructor(
    private readonly gradingRepository: GradingRepository,
    private readonly productsService: ProductsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly geminiService: GeminiService,
  ) {}

  async generateGrade(productId: string, imageUrl?: string, condition?: string, originalImageUrl?: string): Promise<ProductGrade> {
    const product = await this.productsService.findOne(productId);

    // Use provided real data or fallback to generic data for MVP testing
    const conditionNotes = condition || "Customer stated screen has minor scratches, battery holds charge.";
    const imageUrls = imageUrl ? [imageUrl] : ['https://example.com/product_image.jpg'];

    let aiResult;
    try {
      aiResult = await this.geminiService.evaluateProductDamage(imageUrls, conditionNotes, originalImageUrl);
    } catch (error) {
      throw new InternalServerErrorException('AI evaluation engine is currently unavailable');
    }

    const mappedGradeValue: ProductGradeValue = (aiResult.grade as ProductGradeValue) || ProductGradeValue.GRADE_C;

    const grade = await this.gradingRepository.create({
      grade: mappedGradeValue,
      confidenceScore: aiResult.confidenceScore || 85,
      damageSummary: aiResult.damageSummary || 'Standard wear and tear',
      product: { connect: { id: productId } },
      gradedBy: 'GEMINI_AI',
    });

    this.eventEmitter.emit('grading.completed', {
      productId,
      gradeId: grade.id,
      gradeValue: grade.grade,
    });

    return {
      ...grade,
      isMismatch: aiResult.isMismatch || false
    } as any;
  }

  async getProductGrade(productId: string): Promise<ProductGrade> {
    const grades = await this.gradingRepository.findAll({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    
    if (!grades.length) {
      throw new NotFoundException(`No grades found for product ${productId}`);
    }
    return grades[0];
  }
}
