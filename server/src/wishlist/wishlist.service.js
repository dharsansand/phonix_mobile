import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

@Injectable()
@Dependencies(getModelToken('Wishlist'))
export class WishlistService {
  constructor(wishlistModel) {
    this.wishlistModel = wishlistModel;
  }

  // 🟢 1. Toggle Item in Wishlist (Add if not present, Remove if already exists)
  async toggleWishlist(data) {
    const {
      customerId,
      productId,
      stockId,
      variantId,
      name,
      slug,
      colour,
      capacity,
      image,
      price,
      original_price,
    } = data;

    let wishlist = await this.wishlistModel.findOne({ customerId });

    if (!wishlist) {
      wishlist = new this.wishlistModel({
        customerId,
        items: [],
      });
    }

    const existingIndex = wishlist.items.findIndex(
      (item) =>
        String(item.productId) === String(productId) &&
        String(item.stockId) === String(stockId),
    );

    let isAdded = false;

    if (existingIndex > -1) {
      // 🟢 Item already in wishlist -> Remove it (Toggle Off)
      wishlist.items.splice(existingIndex, 1);
      isAdded = false;
    } else {
      // 🟢 Item not in wishlist -> Add it (Toggle On)
      wishlist.items.push({
        productId,
        stockId,
        variantId: variantId || null,
        name,
        slug: slug || '',
        colour: colour || '',
        capacity: capacity || '',
        image: image || '',
        price: Number(price),
        original_price: original_price ? Number(original_price) : null,
      });
      isAdded = true;
    }

    await wishlist.save();

    return {
      message: isAdded
        ? 'Added to wishlist successfully'
        : 'Removed from wishlist successfully',
      isAdded,
      wishlist,
    };
  }

  // 🟢 2. Bulk Sync Wishlist from LocalStorage on Login
  async syncWishlist(customerId, items) {
    if (!Array.isArray(items) || items.length === 0) {
      return await this.getWishlist(customerId);
    }

    let wishlist = await this.wishlistModel.findOne({ customerId });
    if (!wishlist) {
      wishlist = new this.wishlistModel({ customerId, items: [] });
    }

    for (const item of items) {
      const exists = wishlist.items.some(
        (it) =>
          String(it.productId) === String(item.productId) &&
          String(it.stockId) === String(item.stockId),
      );

      if (!exists) {
        wishlist.items.push({
          productId: item.productId,
          stockId: item.stockId,
          variantId: item.variantId || null,
          name: item.name,
          slug: item.slug || '',
          colour: item.colour || '',
          capacity: item.capacity || '',
          image: item.image || '',
          price: Number(item.price || 0),
          totalPrice: Number(item.totalPrice || item.price || 0), // 👈 Solves Mongoose validator requirement
          original_price: item.original_price
            ? Number(item.original_price)
            : null,
        });
      }
    }

    await wishlist.save();
    return wishlist;
  }

  // 🟢 3. Get Customer's Wishlist
  async getWishlist(customerId) {
    const wishlist = await this.wishlistModel.findOne({ customerId });
    if (!wishlist) {
      return { customerId, items: [] };
    }
    return wishlist;
  }

  // 🟢 4. Remove Single Item from Wishlist
  async removeItem(customerId, stockId) {
    const wishlist = await this.wishlistModel.findOne({ customerId });
    if (!wishlist) throw new NotFoundException('Wishlist not found');

    wishlist.items = wishlist.items.filter(
      (it) => String(it.stockId) !== String(stockId),
    );

    await wishlist.save();
    return wishlist;
  }

  // 🟢 5. Clear Entire Wishlist
  async clearWishlist(customerId) {
    const wishlist = await this.wishlistModel.findOne({ customerId });
    if (wishlist) {
      wishlist.items = [];
      await wishlist.save();
    }
    return { message: 'Wishlist cleared successfully' };
  }
}
