import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnsRepository } from './returns.repository';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnRequest } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReturnsService {
  constructor(
    private readonly returnsRepository: ReturnsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateReturnDto): Promise<ReturnRequest> {
    const returnReq = await this.returnsRepository.create({
      reason: dto.reason,
      status: 'REQUESTED',
      user: { connect: { id: userId } },
      product: { connect: { id: dto.productId } },
      media: dto.mediaUrls ? {
        create: dto.mediaUrls.map((url) => ({
          mediaUrl: url,
          mediaType: 'IMAGE', // simplify for MVP
        })),
      } : undefined,
    });

    // Trigger async AI grading evaluation
    this.eventEmitter.emit('return.created', returnReq);

    return returnReq;
  }

  async findByUser(userId: string): Promise<ReturnRequest[]> {
    return this.returnsRepository.findByUserId(userId);
  }

  async findOne(id: string): Promise<ReturnRequest> {
    const req = await this.returnsRepository.findById(id);
    if (!req) {
      throw new NotFoundException(`Return Request with ID ${id} not found`);
    }
    return req;
  }
}
