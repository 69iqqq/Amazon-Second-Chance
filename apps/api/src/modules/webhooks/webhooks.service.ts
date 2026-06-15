import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private prisma: PrismaService) {}

  async handleUserCreated(payload: any) {
    const { id, email_addresses, first_name, last_name, image_url } = payload;
    const primaryEmail = email_addresses.find(
      (email: any) => email.id === payload.primary_email_address_id
    )?.email_address;

    this.logger.log(`Handling user.created for Clerk ID: ${id}`);

    try {
      await this.prisma.$transaction(async (tx: any) => {
        // 1. Create the base User
        const user = await tx.user.create({
          data: {
            clerkId: id,
            email: primaryEmail,
            firstName: first_name,
            lastName: last_name,
            imageUrl: image_url,
            role: 'CUSTOMER', // Default role per 06-authentication-design.md
            status: 'ACTIVE',
          },
        });

        // 2. Initialize GreenCreditWallet
        await tx.greenCreditWallet.create({
          data: {
            userId: user.id,
            balance: 0,
            lifetimeEarned: 0,
            lifetimeRedeemed: 0,
          },
        });

        // 3. Initialize SustainabilityProfile
        await tx.sustainabilityProfile.create({
          data: {
            userId: user.id,
            co2Saved: 0,
            productsReused: 0,
            productsRecycled: 0,
            donationsMade: 0,
            sustainabilityScore: 0,
          },
        });

        this.logger.log(`Successfully synced new user ${user.id} and initialized profiles.`);
      });
    } catch (error: any) {
      this.logger.error(`Failed to handle user.created: ${error.message}`);
      throw error;
    }
  }

  async handleUserUpdated(payload: any) {
    const { id, email_addresses, first_name, last_name, image_url } = payload;
    const primaryEmail = email_addresses.find(
      (email: any) => email.id === payload.primary_email_address_id
    )?.email_address;

    this.logger.log(`Handling user.updated for Clerk ID: ${id}`);

    try {
      await this.prisma.user.update({
        where: { clerkId: id },
        data: {
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      });
      this.logger.log(`Successfully updated user with Clerk ID: ${id}`);
    } catch (error: any) {
      this.logger.error(`Failed to handle user.updated: ${error.message}`);
      throw error;
    }
  }

  async handleUserDeleted(payload: any) {
    const { id } = payload;
    this.logger.log(`Handling user.deleted for Clerk ID: ${id}`);

    try {
      await this.prisma.user.update({
        where: { clerkId: id },
        data: {
          status: 'INACTIVE',
          deletedAt: new Date(),
        },
      });
      this.logger.log(`Soft-deleted user with Clerk ID: ${id}`);
    } catch (error: any) {
      this.logger.error(`Failed to handle user.deleted: ${error.message}`);
      throw error;
    }
  }
}
