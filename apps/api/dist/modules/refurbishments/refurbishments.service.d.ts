import { RefurbishmentsRepository } from './refurbishments.repository';
import { CreateRefurbishmentDto } from './dto/create-refurbishment.dto';
import { UpdateRefurbishmentStatusDto } from './dto/update-refurbishment-status.dto';
import { RefurbishmentRecord } from "@prisma/client";
export declare class RefurbishmentsService {
    private readonly refurbishmentsRepository;
    constructor(refurbishmentsRepository: RefurbishmentsRepository);
    create(dto: CreateRefurbishmentDto): Promise<RefurbishmentRecord>;
    findOne(id: string): Promise<RefurbishmentRecord>;
    updateStatus(id: string, dto: UpdateRefurbishmentStatusDto): Promise<RefurbishmentRecord>;
}
