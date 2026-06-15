import { PrismaService } from '../database/prisma.service';
export declare class WebhooksService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleUserCreated(payload: any): Promise<void>;
    handleUserUpdated(payload: any): Promise<void>;
    handleUserDeleted(payload: any): Promise<void>;
}
