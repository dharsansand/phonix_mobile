import mongoose from 'mongoose';

// 1. Sub-schema for the Variant array
const VariantSchema = new mongoose.Schema(
  {
    colour: {
      type: String,
      default: '',
    },
    colour_code: {
      type: String,
      default: '#000000',
    },
    price: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: '',
    },
    display_size: {
      type: String,
      default: '',
    },
    capacity: {
      type: String,
      default: '',
    },
    initial_stock: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    original_price: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      default: '',
    },
    meta_title: {
      type: String,
      default: '',
    },
    meta_description: {
      type: String,
      default: '',
    },
    meta_keywords: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { _id: true },
);

// 2. Main Product Schema
export const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    producttype: {
      type: String,
      required: true,
      enum: [
        'basic',
        'colour',
        'colour_size',
        'colour_display',
        'colour_capacity',
        'sale_quantity',
      ],
      default: 'basic',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    unit: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    original_price: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      default: '',
    },
    meta_title: {
      type: String,
      default: '',
    },
    meta_description: {
      type: String,
      default: '',
    },
    meta_keywords: {
      type: String,
      default: '',
    },
    initial_stock: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    productImage: {
      type: [String],
      default: [],
    },

    variants: {
      type: [VariantSchema],
      default: [],
    },
    isdelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
