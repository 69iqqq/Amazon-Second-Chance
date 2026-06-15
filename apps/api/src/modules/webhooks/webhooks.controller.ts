import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Webhook } from 'svix';
import { ConfigService } from '@nestjs/config';

@Controller('webhooks/clerk')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async handleWebhook(
    @Req() req: any,
    @Res() res: any,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      this.logger.error('Missing svix headers');
      throw new BadRequestException('Missing svix headers');
    }

    const webhookSecret = this.configService.get<string>('CLERK_WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.logger.error('CLERK_WEBHOOK_SECRET is not configured');
      throw new Error('CLERK_WEBHOOK_SECRET is not configured');
    }

    // Get the raw body
    let payload: any;
    try {
      const wh = new Webhook(webhookSecret);
      // NestJS parses body by default, but Svix needs raw string or buffer.
      // Assuming a middleware stores raw body on req.rawBody or we convert back to string
      // Note: for production, configure NestJS rawBody: true in bootstrap
      const rawBody = req.rawBody ? req.rawBody : JSON.stringify(req.body);
      
      payload = wh.verify(rawBody, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err: any) {
      this.logger.error(`Webhook verification failed: ${err.message}`);
      throw new BadRequestException('Invalid signature');
    }

    const eventType = payload.type;
    this.logger.log(`Received webhook: ${eventType}`);

    switch (eventType) {
      case 'user.created':
        await this.webhooksService.handleUserCreated(payload.data);
        break;
      case 'user.updated':
        await this.webhooksService.handleUserUpdated(payload.data);
        break;
      case 'user.deleted':
        await this.webhooksService.handleUserDeleted(payload.data);
        break;
      default:
        this.logger.warn(`Unhandled webhook event type: ${eventType}`);
    }

    return res.status(200).json({ success: true });
  }
}
