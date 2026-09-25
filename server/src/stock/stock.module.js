import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockSchema } from './stock.schema.js';
import { StockController } from './stocke.controller.js';
import { StockService } from './stock.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Stock', schema: StockSchema }]),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [MongooseModule],
})
export class StockModule {}
