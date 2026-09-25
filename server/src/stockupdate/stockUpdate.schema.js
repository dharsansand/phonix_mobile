import mongoose from 'mongoose';

const StockItemSchema = new mongoose.Schema(
  {
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    colour: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    capacity: {
      type: String,
      default: '',
    },
    displaysize: {
      type: String,
      default: '',
    },

    currentQuantity: {
      type: Number,
      default: 0,
    },

    actionType: {
      type: String,
      enum: ['add', 'return'],
      default: 'add',
    },

    changeQuantity: {
      type: Number,

      default: 0,
    },
    currentPrice: {
      type: Number,
    },
    price: {
      type: Number,
    },
    currentOriginalPrice: {
      type: Number,
    },
    original_price: {
      type: Number,
    },

    finalQuantity: {
      type: Number,
    },
  },
  { _id: false },
);

export const StockUpdateSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    stocks: {
      type: [StockItemSchema],
    },
    isdelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
