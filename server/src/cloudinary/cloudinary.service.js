import { Injectable, BadRequestException, Dependencies } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
@Dependencies('CLOUDINARY') // <-- CRITICAL: Tells NestJS to execute CloudinaryProvider
export class CloudinaryService {
  constructor(cloudinaryConfig) {
    // cloudinary is now configured and ready
  }

  async uploadImage(file, folderName = 'banners') {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }
}