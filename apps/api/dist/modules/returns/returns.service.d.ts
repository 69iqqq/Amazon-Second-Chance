import { ReturnsRepository } from './returns.repository';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnRequest } from "@prisma/client";
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class ReturnsService {
    private readonly returnsRepository;
    private readonly eventEmitter;
    constructor(returnsRepository: ReturnsRepository, eventEmitter: EventEmitter2);
    create(userId: string, dto: CreateReturnDto): Promise<ReturnRequest>;
    findByUser(userId: string): Promise<ReturnRequest[]>;
    findOne(id: string): Promise<ReturnRequest>;
}
