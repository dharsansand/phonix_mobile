import mongoose from 'mongoose';

// 🟢 Wishlist Item Sub-schema
const wishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      default: '',
      trim: true,
    },
    colour: {
      type: String,
      default: '',
    },
    capacity: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
    },
    original_price: {
      type: Number,
      default: null,
    },
    // 🟢 totalPrice is optional or removed for wishlist
    totalPrice: {
      type: Number,
    },
  },
  { _id: false },
);

// 🟢 Main Wishlist Schema
export const wishlistSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',

      unique: true,
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  },
);
