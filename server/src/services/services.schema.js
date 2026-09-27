import mongoose from 'mongoose';

export const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    device: {
      type: String,
      required: true,
      trim: true,
    },
    turnaround: {
      type: String,
      required: true,
      default: '30 Mins',
    },
    warranty: {
      type: String,
      required: true,
      default: '90 Days Warranty',
    },
    badge: {
      type: String,
      default: 'MOST POPULAR',
    },
    beforeImg: {
      type: String,
      default: '',
    },
    afterImg: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    // SEO Fields
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
    isActive: {
      type: Boolean,
      default: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
