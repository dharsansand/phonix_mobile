import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { wishlistSchema } from './wishlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Wishlist', schema: wishlistSchema }]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
