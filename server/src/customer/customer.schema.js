// customer.schema.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    streetAddress: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: 'Tamil Nadu', trim: true },
    pincode: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }, // 👈 Generates an ID like 6aa... so the customer can select this address
);

export const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, default: '', trim: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' },
    refreshToken: { type: String, default: null },

    // 🟢 1. Active / Currently Selected Delivery Address
    selectedAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // 🟢 2. Array of Multiple Saved Addresses (Home, Office, Temple, etc.)
    savedAddresses: {
      type: [addressSchema],
      default: [],
    },

    isdelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
