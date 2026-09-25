import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ProductSchema } from './product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    CloudinaryModule,
    StockModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
