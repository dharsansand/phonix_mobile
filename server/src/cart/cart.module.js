import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { cartSchema } from './cart.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cart', schema: cartSchema }])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
