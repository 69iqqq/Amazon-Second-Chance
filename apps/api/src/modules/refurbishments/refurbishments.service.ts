import { Injectable, NotFoundException } from '@nestjs/common';
import { RefurbishmentsRepository } from './refurbishments.repository';
import { CreateRefurbishmentDto } from './dto/create-refurbishment.dto';
import { UpdateRefurbishmentStatusDto } from './dto/update-refurbishment-status.dto';
import { RefurbishmentRecord } from '@prisma/client';

@Injectable()
export class RefurbishmentsService {
  constructor(private readonly refurbishmentsRepository: RefurbishmentsRepository) {}

  async create(dto: CreateRefurbishmentDto): Promise<RefurbishmentRecord> {
    return this.refurbishmentsRepository.create({
      status: 'PENDING',
      // notes: dto.notes,
      product: { connect: { id: dto.productId } },
      partner: { connect: { id: dto.partnerId } },
    });
  }

  async findOne(id: string): Promise<RefurbishmentRecord> {
    const record = await this.refurbishmentsRepository.findById(id);
    if (!record) {
      throw new NotFoundException(`Refurbishment record ${id} not found`);
    }
    return record;
  }

  async updateStatus(id: string, dto: UpdateRefurbishmentStatusDto): Promise<RefurbishmentRecord> {
    await this.findOne(id); // Ensure exists
    
    const updateData: any = { status: dto.status };
    if (dto.status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    return this.refurbishmentsRepository.update(id, updateData);
  }
}
