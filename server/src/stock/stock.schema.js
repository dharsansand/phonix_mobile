import mongoose from 'mongoose';
export const StockSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    type: {
      type: String,
      enum: ['initial', 'purchase', 'sale', 'return', 'adjustment'],
      required: true,
    },
    colour: {
      type: String,
      default: '',
    },

    price: {
      type: Number,
      default: 0,
    },
    original_price: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: '',
    },
    displaysize: {
      type: String,
      default: '',
    },
    capacity: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    isdelete: { type: Boolean, default: false },
  },
  { timestamps: true },
);
