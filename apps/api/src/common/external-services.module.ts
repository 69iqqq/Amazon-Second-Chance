import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';
import { GeminiService } from './services/gemini.service';

@Global()
@Module({
  providers: [CloudinaryService, GeminiService],
  exports: [CloudinaryService, GeminiService],
})
export class ExternalServicesModule {}
