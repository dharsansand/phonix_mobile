import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
    role: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  },
);
