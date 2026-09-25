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
  Req,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { ProductService } from './product.service.js';
@Controller('product')
@Dependencies(ProductService, CloudinaryService)
export class ProductController {
  constructor(productService, cloudinaryService) {
    this.productService = productService;
    this.cloudinaryService = cloudinaryService;
  }
  @Get('mainproduct')
  @Bind(Query())
  async getMainProduct(query) {
    return await this.productService.findMainProduct(query);
  }

  @Post(['upload', 'product'])
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
    const result = await this.cloudinaryService.uploadImage(file, 'product');
    return {
      message: 'File Upload successfully',
      file: {
        filename: result.secure_url,
      },
    };
  }

  @Post()
  @Bind(Body())
  async createProduct(body) {
    return await this.productService.create(body);
  }

  @Get()
  async getAllProduct() {
    return await this.productService.findAll();
  }

  @Get('homeproductcategory')
  async getHomeProductCategory() {
    return await this.productService.findHomeProductCategory();
  }
  @Get('viewproduct/:id')
  @Bind(Param('id'))
  async getProductDetails(id) {
    return await this.productService.findProductDetails(id);
  }

  @Get(':id')
  @Bind(Param('id'))
  async getSingleProduct(id) {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  async updateProduct(id, body) {
    return await this.productService.update(id, body);
  }

  @Delete(':id')
  @Bind(Param('id'))
  async deleteProduct(id) {
    return await this.productService.delete(id);
  }
}
