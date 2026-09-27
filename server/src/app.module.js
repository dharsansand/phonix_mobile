// app.module.js
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { BannerModule } from './banner/banner.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { StockUpdateModule } from './stockupdate/stockupdate.module';
import { CustomerModule } from './customer/customer.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { OrderModule } from './order/order.module';
import { UpTimeRobotModule } from './uptimerobot/upTimeRobot.module';
import { ServiceModule } from './services/services.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    BannerModule,
    CloudinaryModule,
    CategoryModule,
    ProductModule,
    StockModule,
    StockUpdateModule,
    CustomerModule,
    CartModule,
    OrderModule,
    WishlistModule,
    UpTimeRobotModule,
    ServiceModule,
  ],
})
export class AppModule {}
