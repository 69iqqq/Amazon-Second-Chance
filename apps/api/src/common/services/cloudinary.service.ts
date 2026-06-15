import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: any, folder: string = 'amahawk'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          fetch_format: 'webp',
          quality: 'auto',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(new InternalServerErrorException('Image upload failed'));
          }
          if (!result) {
            return reject(new InternalServerErrorException('Image upload returned no result'));
          }
          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
