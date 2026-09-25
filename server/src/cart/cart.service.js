import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

@Injectable()
@Dependencies(getModelToken('Cart'))
export class CartService {
  constructor(cartModel) {
    this.cartModel = cartModel;
  }

  // 🟢 1. Add Item to Cart (Handles both guest syncing & single item adds)
  async addToCart(data) {
    const {
      customerId,
      productId,
      stockId,
      variantId,
      name,
      slug,
      colour,
      capacity,
      unit,
      image,
      price,
      quantity = 1,
      totalPrice,
    } = data;

    // Find the customer's active cart or create one
    let cart = await this.cartModel.findOne({ customerId });

    if (!cart) {
      cart = new this.cartModel({
        customerId,
        items: [],
      });
    }

    // Check if item already exists in the cart (by matching productId & stockId)
    const existingIndex = cart.items.findIndex(
      (item) =>
        String(item.productId) === String(productId) &&
        String(item.stockId) === String(stockId),
    );

    const calculatedTotalPrice = Number(totalPrice || price * quantity);

    if (existingIndex > -1) {
      // 🟢 Item exists -> increment quantity & recalculate totalPrice
      cart.items[existingIndex].quantity += Number(quantity);
      cart.items[existingIndex].totalPrice =
        cart.items[existingIndex].quantity * Number(price);
    } else {
      // 🟢 New item -> push complete object matching your schema
      cart.items.push({
        productId,
        stockId,
        variantId: variantId || null,
        name,
        slug: slug || '',
        colour: colour || '',
        capacity: capacity || '',
        unit: unit || 'no',
        image: image || '',
        price: Number(price),
        quantity: Number(quantity),
        totalPrice: calculatedTotalPrice,
      });
    }

    // Save triggers the pre('save') hook to compute totalItems & totalAmount
    await cart.save();

    return {
      message: 'Cart updated successfully',
      cart,
    };
  }

  // 🟢 2. Bulk Sync Cart (Syncs whole localStorage array in 1 single request)
  async syncCart(customerId, items) {
    if (!Array.isArray(items) || items.length === 0) {
      return await this.getCart(customerId);
    }

    let cart = await this.cartModel.findOne({ customerId });
    if (!cart) {
      cart = new this.cartModel({ customerId, items: [] });
    }

    for (const item of items) {
      const idx = cart.items.findIndex(
        (it) =>
          String(it.productId) === String(item.productId) &&
          String(it.stockId) === String(item.stockId),
      );

      const itemQty = Number(item.quantity || 1);
      const itemPrice = Number(item.price);
      const itemTotalPrice = Number(item.totalPrice || itemPrice * itemQty);

      if (idx > -1) {
        cart.items[idx].quantity += itemQty;
        cart.items[idx].totalPrice = cart.items[idx].quantity * itemPrice;
      } else {
        cart.items.push({
          productId: item.productId,
          stockId: item.stockId,
          variantId: item.variantId || null,
          name: item.name,
          slug: item.slug || '',
          colour: item.colour || '',
          capacity: item.capacity || '',
          unit: item.unit || 'no',
          image: item.image || '',
          price: itemPrice,
          quantity: itemQty,
          totalPrice: itemTotalPrice,
        });
      }
    }

    await cart.save();
    return cart;
  }

  // 🟢 3. Get Customer Cart
  async getCart(customerId) {
    const cart = await this.cartModel.findOne({ customerId });
    if (!cart) {
      return { customerId, items: [], totalItems: 0, totalAmount: 0 };
    }
    return cart;
  }

  // 🟢 4. Update Item Quantity
  async updateQuantity(customerId, stockId, quantity) {
    const cart = await this.cartModel.findOne({ customerId });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find(
      (it) => String(it.stockId) === String(stockId),
    );
    if (!item) throw new NotFoundException('Item not in cart');

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (it) => String(it.stockId) !== String(stockId),
      );
    } else {
      item.quantity = Number(quantity);
      item.totalPrice = item.quantity * item.price;
    }

    await cart.save();
    return cart;
  }

  // 🟢 5. Remove Single Item
  async removeItem(customerId, stockId) {
    const cart = await this.cartModel.findOne({ customerId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter(
      (it) => String(it.stockId) !== String(stockId),
    );
    await cart.save();
    return cart;
  }

  // 🟢 6. Clear Cart
  // 🟢 Clear Cart
  async clearCart(customerId) {
    const mongoose = this.cartModel.base || require('mongoose');
    const { Types } = mongoose;

    // Support both ObjectId and String match
    const filter = {
      $or: [
        { customerId: customerId },
        ...(Types.ObjectId.isValid(customerId)
          ? [{ customerId: new Types.ObjectId(customerId) }]
          : []),
      ],
    };

    // Atomically reset items, totalItems, and totalAmount
    const updatedCart = await this.cartModel.findOneAndUpdate(
      filter,
      {
        $set: {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        },
      },
      { new: true },
    );

    return {
      message: 'Cart cleared successfully',
      cart: updatedCart || {
        customerId,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      },
    };
  }
}
