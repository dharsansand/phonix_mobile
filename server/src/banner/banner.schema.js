import mongoose from 'mongoose';

export const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String, default: '' },
    content: { type: String, default: '' },
    highlight: { type: String, default: '' },
    banner: { type: Array, required: true, default: [] },
    Active: { type: Boolean, default: false },
    theme: { type: String, default: 'silver' },
    badge: { type: String, default: '' },
    isdelete: { type: Boolean, default: false },
  },
  { timestamps: true },
);
