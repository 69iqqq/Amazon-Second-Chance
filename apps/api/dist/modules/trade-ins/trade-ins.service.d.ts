import { TradeInsRepository } from './trade-ins.repository';
import { CreateTradeInDto } from './dto/create-trade-in.dto';
import { TradeInRequest } from "@prisma/client";
export declare class TradeInsService {
    private readonly tradeInsRepository;
    constructor(tradeInsRepository: TradeInsRepository);
    create(userId: string, dto: CreateTradeInDto): Promise<TradeInRequest>;
    findOne(id: string): Promise<TradeInRequest>;
    approve(id: string): Promise<TradeInRequest>;
}
