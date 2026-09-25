import mongoose from 'mongoose';

// 🟢 1. Ordered Item Snapshot Sub-schema
const orderItemSchema = new mongoose.Schema(
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

// 🟢 2. Delivery Address Snapshot Sub-schema
const orderAddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    streetAddress: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: 'Tamil Nadu', trim: true },
    pincode: { type: String, required: true, trim: true },
  },
  { _id: false },
);

// 🟢 3. Main Order Schema
export const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // e.g. "KC-482019"
      index: true,
    },

    // Reference to Customer (Optional if guest orders are allowed)
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },

    // Ordered Products
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(val) => val.length > 0, 'Order must have at least one item.'],
    },

    // Delivery Snapshot
    deliveryAddress: {
      type: orderAddressSchema,
      required: true,
    },

    // Financial Breakdown
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment Information
    paymentMethod: {
      type: String,
      enum: ['cod', 'online', 'upi', 'card'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDetails: {
      transactionId: { type: String, default: '' },
      paymentGateway: { type: String, default: '' },
    },

    // Order Lifecycle Status
    orderStatus: {
      type: String,
      enum: [
        'placed',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'placed',
    },

    trackingNumber: {
      type: String,
      default: '',
    },
    courierPartner: {
      type: String,
      default: '',
    },

    notes: {
      type: String,
      default: '',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Auto adds createdAt & updatedAt
  },
);
