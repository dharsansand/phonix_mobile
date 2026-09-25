import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { orderSchema } from './order.schema';
import { StockSchema } from '../stock/stock.schema';
import { cartSchema } from '../cart/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: orderSchema },
      { name: 'Stock', schema: StockSchema },
      { name: 'Cart', schema: cartSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
