import {
  Injectable,
  NotFoundException,
  Dependencies,
  ConflictException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
@Injectable()
@Dependencies(getModelToken('Stock'))
export class StockService {
  constructor(stockModel) {
    this.stockModel = stockModel;
  }

  async findAll() {
    return await this.stockModel
      .find({ isdelete: false })
      .populate([
        { path: 'product', select: 'name' },
        { path: 'category', select: 'name' },
      ])
      .sort({ createdAt: -1 });
  }
}
