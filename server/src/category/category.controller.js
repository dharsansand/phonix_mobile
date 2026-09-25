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
  Bind, } from '@nestjs/common';
import { CategoryService } from './category.service.js';

  @Controller('category')
  @Dependencies(CategoryService)
export class CategoryController {

      constructor(categoryService){
           this.categoryService = categoryService;
      }
        @Post()
        @Bind(Body())
          async createCategory(body) {
            return await this.categoryService.create(body);
          }

            
  @Get()
  async getAllBanners() {
    return await this.categoryService.findAll();
  }


  @Get(':id')
  @Bind(Param('id'))
  async getSingleBanner(id) {
    return await this.categoryService.findOne(id);
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  async updateBanner(id, body) {
    return await this.categoryService.update(id, body);
  }

  @Delete(':id')
  @Bind(Param('id'))
  async deleteBanner(id) {
    return await this.categoryService.delete(id);
  }

}