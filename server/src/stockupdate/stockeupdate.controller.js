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
import { StockUpdateService } from './stcokupdate.service';

@Controller('stock-update')
@Dependencies(StockUpdateService)
export class StockUpdateController {
  constructor(stockUpdateService) {
    this.stockUpdateService = stockUpdateService;
  }
  @Post()
  @Bind(Body())
  async createCategory(body) {
    return await this.stockUpdateService.create(body);
  }

  @Get()
  async getAllBanners() {
    return await this.stockUpdateService.findAll();
  }

  @Get(':id')
  @Bind(Param('id'))
  async getSingleBanner(id) {
    return await this.stockUpdateService.findOne(id);
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  async updateBanner(id, body) {
    return await this.stockUpdateService.update(id, body);
  }

  @Delete(':id')
  @Bind(Param('id'))
  async deleteBanner(id) {
    return await this.stockUpdateService.delete(id);
  }
}
