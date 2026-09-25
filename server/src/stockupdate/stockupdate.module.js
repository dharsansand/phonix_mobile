import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockUpdateController } from './stockeupdate.controller';
import { StockUpdateService } from './stcokupdate.service';
import { StockUpdateSchema } from './stockUpdate.schema';

import { StockSchema } from '../stock/stock.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StockUpdate', schema: StockUpdateSchema },
      { name: 'Stock', schema: StockSchema },
    ]),
  ],
  controllers: [StockUpdateController],
  providers: [StockUpdateService],
})
export class StockUpdateModule {}
