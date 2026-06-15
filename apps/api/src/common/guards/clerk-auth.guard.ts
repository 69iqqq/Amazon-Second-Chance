import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../../modules/database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authentication token');
    }

    const token = authHeader.split(' ')[1];
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');

    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY is not configured');
    }

    try {
      // 1. Verify the Clerk JWT
      const verifiedToken = await verifyToken(token, {
        secretKey,
      });

      // 2. Load the user from the database using clerkId, auto-create if missing (dev mode)
      let user = await this.prisma.user.findUnique({
        where: { clerkId: verifiedToken.sub },
      });

      if (!user) {
        // Auto-create for local testing so we don't need Ngrok
        user = await this.prisma.user.create({
          data: {
            clerkId: verifiedToken.sub,
            email: verifiedToken.email ? (verifiedToken.email as string) : `${verifiedToken.sub}@temp.com`,
            role: 'CUSTOMER',
            status: 'ACTIVE',
          },
        });
      }

      if (user.status !== 'ACTIVE') {
        throw new UnauthorizedException(`User account is ${user.status}`);
      }

      // 3. Inject user into request for downstream use
      request.user = user;
      request.auth = verifiedToken; // Raw clerk auth data

      return true;
    } catch (error) {
      console.error('ClerkAuthGuard Error:', error);
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
