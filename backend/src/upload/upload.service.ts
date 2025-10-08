import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private config: ConfigService) {
    const cloudName = this.config.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get('CLOUDINARY_API_SECRET');

    // Log configuration (without sensitive data)
    this.logger.log(`Cloudinary config - Cloud Name: ${cloudName}, API Key: ${apiKey ? '***' + apiKey.slice(-4) : 'MISSING'}, Secret: ${apiSecret ? '***' + apiSecret.slice(-4) : 'MISSING'}`);

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.error('Missing Cloudinary configuration');
      throw new Error('Cloudinary configuration is incomplete');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadImage(file: any): Promise<string> {
    this.logger.log(`Starting upload for file: ${file?.originalname}, size: ${file?.size}, type: ${file?.mimetype}`);

    if (!file) {
      this.logger.error('No file provided');
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      this.logger.error(`Invalid file type: ${file.mimetype}`);
      throw new BadRequestException('Only image files are allowed');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      this.logger.error(`File too large: ${file.size} bytes`);
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'fashionstore/products',
          resource_type: 'image',
          // Add timestamp to avoid caching issues
          timestamp: Math.round(new Date().getTime() / 1000),
          // Remove upload_preset as it's not configured in Cloudinary
        },
        (error, result) => {
          if (error) {
            this.logger.error(`Cloudinary upload error: ${error.message}`, error.stack);
            reject(new BadRequestException(`Upload failed: ${error.message}`));
          } else {
            this.logger.log(`Upload successful: ${result.secure_url}`);
            resolve(result.secure_url);
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultiple(files: any[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new BadRequestException('Delete failed: ' + error.message);
    }
  }
}














