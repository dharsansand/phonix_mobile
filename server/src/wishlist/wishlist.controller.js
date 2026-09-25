import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Dependencies,
  Bind,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@Dependencies(WishlistService)
export class WishlistController {
  constructor(wishlistService) {
    this.wishlistService = wishlistService;
  }

  // 🟢 1. Toggle Wishlist Item (POST /wishlist/toggle)
  @Post('toggle')
  @Bind(Body())
  toggleWishlist(body) {
    return this.wishlistService.toggleWishlist(body);
  }

  // 🟢 2. Sync Wishlist on Customer Login (POST /wishlist/sync)
  @Post('sync')
  @Bind(Body())
  syncWishlist(body) {
    return this.wishlistService.syncWishlist(body.customerId, body.items);
  }

  // 🟢 3. Get Customer Wishlist (GET /wishlist/:customerId)
  @Get(':customerId')
  @Bind(Param('customerId'))
  getWishlist(customerId) {
    return this.wishlistService.getWishlist(customerId);
  }
  @Delete('clear/:customerId')
  @Bind(Param('customerId'))
  clearWishlist(customerId) {
    return this.wishlistService.clearWishlist(customerId);
  }
  // 🟢 4. Remove Single Item (DELETE /wishlist/:customerId/:stockId)
  @Delete(':customerId/:stockId')
  @Bind(Param('customerId'), Param('stockId'))
  removeItem(customerId, stockId) {
    return this.wishlistService.removeItem(customerId, stockId);
  }

  // 🟢 5. Clear All (DELETE /wishlist/clear/:customerId)
}
