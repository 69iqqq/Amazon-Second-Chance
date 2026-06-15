import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DispositionRepository } from './disposition.repository';
import { OverrideDecisionDto } from './dto/override-decision.dto';
import { DispositionDecision, DispositionType, ProductGrade } from '@prisma/client';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class DispositionService {
  constructor(private readonly dispositionRepository: DispositionRepository) {}

  @OnEvent('grading.completed')
  async handleGradingCompleted(grade: ProductGrade) {
    // Automatically trigger disposition when a new grade is created
    await this.generateDecision(grade.productId, null);
  }

  async generateDecision(productId: string, returnRequestId: string | null): Promise<DispositionDecision> {
    // In MVP, we mock the AI Disposition logic
    const mockDecision = await this.dispositionRepository.create({
      product: { connect: { id: productId } },
      decision: DispositionType.REFURBISH,
      confidence: 94.2,
      reason: 'High resale value after minor screen repair',
      isOverridden: false,
    });

    if (returnRequestId) {
      await this.dispositionRepository.update(mockDecision.id, {
        returnRequest: { connect: { id: returnRequestId } }
      } as any);
    }

    return mockDecision;
  }

  async getLatestDecision(productId: string): Promise<DispositionDecision> {
    const decisions = await this.dispositionRepository.findByProductId(productId);
    if (decisions.length === 0) {
      throw new NotFoundException(`No disposition decision found for product ${productId}`);
    }
    return decisions[0]; // First one is latest because of orderBy
  }

  async overrideDecision(id: string, adminId: string, dto: OverrideDecisionDto): Promise<DispositionDecision> {
    const decision = await this.dispositionRepository.findById(id);
    if (!decision) {
      throw new NotFoundException(`Disposition Decision ${id} not found`);
    }

    if (decision.isOverridden) {
      throw new BadRequestException(`Decision has already been overridden.`);
    }

    return this.dispositionRepository.update(id, {
      decision: dto.newDecision,
      isOverridden: true,
      overriddenBy: adminId,
      overrideReason: dto.reason,
    });
  }
}
