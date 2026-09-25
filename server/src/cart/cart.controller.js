import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Dependencies,
  Bind,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../users/auth.guard'; // Adjust to your AuthGuard path

@Controller('cart')
@Dependencies(CartService)
export class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  // 🟢 Add Item to Cart (POST /cart)
  @Post()
  @Bind(Body())
  addToCart(body) {
    return this.cartService.addToCart(body);
  }

  // 🟢 Sync Bulk Cart on login (POST /cart/sync)
  @Post('sync')
  @Bind(Body())
  syncCart(body) {
    return this.cartService.syncCart(body.customerId, body.items);
  }

  // 🟢 Get Cart (GET /cart or GET /cart/:customerId)
  @Get(':customerId')
  @Bind(Param('customerId'))
  getCart(customerId) {
    return this.cartService.getCart(customerId);
  }

  // 🟢 Update Quantity (PATCH /cart/update-quantity)
  @Patch('update-quantity')
  @Bind(Body())
  updateQuantity(body) {
    return this.cartService.updateQuantity(
      body.customerId,
      body.stockId,
      body.quantity,
    );
  }
  @Delete('clear/:customerId')
  @Bind(Param('customerId'))
  clearCart(customerId) {
    return this.cartService.clearCart(customerId);
  }

  // 🟢 Remove Item (DELETE /cart/:customerId/:stockId)
  @Delete(':customerId/:stockId')
  @Bind(Param('customerId'), Param('stockId'))
  removeItem(customerId, stockId) {
    return this.cartService.removeItem(customerId, stockId);
  }

  // 🟢 Clear Entire Cart (DELETE /cart/clear/:customerId)
}
