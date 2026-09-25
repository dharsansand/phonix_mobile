import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Dependencies,
  Bind,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BannerService } from './banner.service.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Controller('banner')
@Dependencies(BannerService, CloudinaryService)
export class BannerController {
  constructor(bannerService, cloudinaryService) {
    this.bannerService = bannerService;
    this.cloudinaryService = cloudinaryService;
  }

  @Post(['upload', 'banner'])
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
    const result = await this.cloudinaryService.uploadImage(file, 'banners');
    return {
      message: 'File Upload successfully',
      file: {
        filename: result.secure_url,
      },
    };
  }

  @Post()
  @Bind(Body())
  async createBanner(body) {
    return await this.bannerService.create(body);
  }
  @Get('font')
  async getFontBanner() {
    return await this.bannerService.findFontBanner();
  }

  @Get()
  async getAllBanners() {
    return await this.bannerService.findAll();
  }

  @Get(':id')
  @Bind(Param('id'))
  async getSingleBanner(id) {
    return await this.bannerService.findOne(id);
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  async updateBanner(id, body) {
    return await this.bannerService.update(id, body);
  }

  @Delete(':id')
  @Bind(Param('id'))
  async deleteBanner(id) {
    return await this.bannerService.delete(id);
  }
}
