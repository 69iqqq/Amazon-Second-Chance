import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TradeInsRepository } from './trade-ins.repository';
import { CreateTradeInDto } from './dto/create-trade-in.dto';
import { TradeInRequest } from '@prisma/client';

@Injectable()
export class TradeInsService {
  constructor(private readonly tradeInsRepository: TradeInsRepository) {}

  async create(userId: string, dto: CreateTradeInDto): Promise<TradeInRequest> {
    return this.tradeInsRepository.create({
      status: 'SUBMITTED',
      user: { connect: { id: userId } },
      product: { connect: { id: dto.productId } },
    });
  }

  async findOne(id: string): Promise<TradeInRequest> {
    const tradeIn = await this.tradeInsRepository.findById(id);
    if (!tradeIn) {
      throw new NotFoundException(`Trade-In request ${id} not found`);
    }
    return tradeIn;
  }

  async approve(id: string): Promise<TradeInRequest> {
    const tradeIn = await this.findOne(id);
    
    if (tradeIn.status !== 'SUBMITTED') {
      throw new BadRequestException('Only pending trade-ins can be approved');
    }

    return this.tradeInsRepository.update(id, {
      status: 'APPROVED',
      approvedAt: new Date(),
    } as any);
  }
}
