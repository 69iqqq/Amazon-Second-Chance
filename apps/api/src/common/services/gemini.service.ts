import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not defined');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async evaluateProductDamage(imageUrls: string[], conditionNotes: string, originalImageUrl?: string): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

      // Process uploaded images
      const imageParts = imageUrls.map(url => {
        if (url.startsWith('data:image')) {
          const matches = url.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            return {
              inlineData: {
                data: matches[2],
                mimeType: matches[1]
              }
            };
          }
        }
        return null;
      }).filter(Boolean);

      // Fetch original catalog image
      let originalImagePart = null;
      if (originalImageUrl && originalImageUrl.startsWith('http')) {
        try {
          const res = await fetch(originalImageUrl);
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          originalImagePart = {
            inlineData: {
              data: buffer.toString('base64'),
              mimeType: res.headers.get('content-type') || 'image/jpeg'
            }
          };
        } catch (e) {
          this.logger.warn(`Failed to fetch original image from ${originalImageUrl} for comparison: ${e}`);
        }
      }

      // Build the prompt
      let prompt = `You are an expert reverse logistics AI evaluator for Amazon 2nd Chance.\n`;
      
      if (originalImagePart) {
        prompt += `Image 1 is the ORIGINAL Catalog Reference Image from the database.\n`;
        prompt += `Image 2 is the RETURNED Item Image uploaded by the customer.\n`;
        prompt += `CRITICAL: Carefully compare the returned item to the original reference image! Look for deviations, missing accessories, scratches, dents, wear and tear, or pristine condition.\n`;
      } else {
        prompt += `Carefully analyze the attached product image(s). Look for scratches, dents, wear and tear, or pristine condition.\n`;
      }
      
      prompt += `
        Customer condition notes: "${conditionNotes}"
        
        Respond with a JSON object strictly containing:
        {
          "isMismatch": boolean (true ONLY IF the returned item in Image 2 is a completely different product type/model than the original in Image 1),
          "grade": "GRADE_A_PLUS" | "GRADE_A" | "GRADE_B" | "GRADE_C" | "GRADE_D" | "GRADE_F",
          "confidenceScore": number (0-100),
          "estimatedResaleValue": number,
          "damageSummary": "A concise description comparing the original to the return, and visible damage. If it is a mismatch, state that the wrong item was returned."
        }
      `;

      const parts = originalImagePart 
        ? [prompt, originalImagePart, ...imageParts]
        : [prompt, ...imageParts];

      const result = await model.generateContent(parts as any);
      const response = await result.response;
      let text = response.text();
      
      // Clean up markdown code blocks if Gemini wraps the JSON
      if (text.startsWith('```json')) {
        text = text.replace('```json', '').replace('```', '').trim();
      }

      return JSON.parse(text);
    } catch (error: any) {
      this.logger.error(`Failed to evaluate product damage: ${error.message}`);
      throw new InternalServerErrorException('AI Evaluation failed');
    }
  }
}
