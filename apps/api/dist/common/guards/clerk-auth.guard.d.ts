import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../../modules/database/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class ClerkAuthGuard implements CanActivate {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
