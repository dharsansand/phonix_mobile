import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Dependencies,
  Bind,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ServiceService } from './services.service';

@Controller('service')
@Dependencies(ServiceService, CloudinaryService)
export class ServiceController {
  constructor(serviceService, cloudinaryService) {
    this.serviceService = serviceService;
    this.cloudinaryService = cloudinaryService;
  }

  // 🟢 Image Upload for Service Case Images
  @Post(['upload', 'service'])
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|avif)$/)) {
          return cb(
            new BadRequestException(
              'Images only! Allowed: JPG, JPEG, PNG, WEBP, AVIF',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Bind(UploadedFile())
  async uploadBannerImage(file) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.cloudinaryService.uploadImage(file, 'service');
    return {
      message: 'File Upload successfully',
      file: {
        filename: result.secure_url,
      },
    };
  }

  // 🟢 POST /service (Create)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Bind(Body())
  create(createDto) {
    return this.serviceService.create(createDto);
  }

  // 🟢 GET /service (Find All)
  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  // 🟢 GET /service/:slug (Find by Slug or ID)
  @Get(':slug')
  @Bind(Param('slug'))
  findOne(slug) {
    return this.serviceService.findOneBySlugOrId(slug);
  }

  // 🟢 PUT /service/:id (Update)
  @Put(':id')
  @Bind(Param('id'), Body())
  update(id, updateDto) {
    return this.serviceService.update(id, updateDto);
  }

  // 🟢 DELETE /service/:id (Soft Delete)
  @Delete(':id')
  @Bind(Param('id'))
  remove(id) {
    return this.serviceService.remove(id);
  }
}
