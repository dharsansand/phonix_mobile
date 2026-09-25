import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerSchema } from './banner.schema.js';
import { BannerController } from './banner.controller.js';
import { BannerService } from './banner.service.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Banner', schema: BannerSchema }]),
    CloudinaryModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}