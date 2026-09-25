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
import { StockService } from './stock.service';

@Controller('stock')
@Dependencies(StockService)
export class StockController {
  constructor(stockService) {
    this.stockService = stockService;
  }
  @Get()
  async getAllstock() {
    return await this.stockService.findAll();
  }
}
