import mongoose from 'mongoose';

// 🟢 Sub-schema for individual Cart Item
const cartItemSchema = new mongoose.Schema(
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
    unit: {
      type: String,
      default: 'no',
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

// 🟢 Main Cart Schema
export const cartSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      unique: true, // One active cart per customer
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
cartSchema.pre('save', function () {
  if (this.items && this.items.length > 0) {
    this.totalItems = this.items.reduce(
      (acc, item) => acc + (Number(item.quantity) || 1),
      0,
    );
    this.totalAmount = this.items.reduce(
      (acc, item) =>
        acc + Number(item.totalPrice || item.price * (item.quantity || 1)),
      0,
    );
  } else {
    this.totalItems = 0;
    this.totalAmount = 0;
  }
});
