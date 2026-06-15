import { WebhooksService } from './webhooks.service';
import { ConfigService } from '@nestjs/config';
export declare class WebhooksController {
    private readonly webhooksService;
    private readonly configService;
    private readonly logger;
    constructor(webhooksService: WebhooksService, configService: ConfigService);
    handleWebhook(req: any, res: any, svixId: string, svixTimestamp: string, svixSignature: string): Promise<any>;
}
