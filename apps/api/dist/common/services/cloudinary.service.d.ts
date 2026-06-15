import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: any, folder?: string): Promise<string>;
}
