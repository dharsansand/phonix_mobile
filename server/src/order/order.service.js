import {
  Injectable,
  Dependencies,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

@Injectable()
@Dependencies(
  getModelToken('Order'),
  getModelToken('Stock'),
  getModelToken('Cart'),
)
export class OrderService {
  constructor(orderModel, stockModel, cartModel) {
    this.orderModel = orderModel;
    this.stockModel = stockModel;
    this.cartModel = cartModel;
  }

  // 🟢 Helper to generate unique human-readable order ID
  generateOrderId() {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `KC-${random}`;
  }

  // 🟢 1. CREATE NEW ORDER (Place Order)
  async createOrder(orderData) {
    const {
      customerId,
      items,
      deliveryAddress,
      subtotal,
      deliveryFee = 0,
      tax = 0,
      totalAmount,
      paymentMethod = 'cod',
    } = orderData;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    if (!deliveryAddress || !deliveryAddress.name || !deliveryAddress.phone) {
      throw new BadRequestException('Valid delivery address is required');
    }

    const orderId = this.generateOrderId();

    const newOrder = new this.orderModel({
      orderId,
      customerId: customerId || null,
      items,
      deliveryAddress: {
        name: deliveryAddress.name,
        phone: deliveryAddress.phone,
        email: deliveryAddress.email || '',
        streetAddress:
          deliveryAddress.streetAddress || deliveryAddress.address || '',
        city: deliveryAddress.city,
        state: deliveryAddress.state || 'Tamil Nadu',
        pincode: deliveryAddress.pincode,
      },
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee),
      tax: Number(tax),
      totalAmount: Number(totalAmount),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
    });

    const savedOrder = await newOrder.save();

    // Decrement stock in Stock collection
    try {
      for (const it of items) {
        if (it.stockId) {
          await this.stockModel.findByIdAndUpdate(it.stockId, {
            $inc: { quantity: -Number(it.quantity || 1) },
          });
        }
      }
    } catch (stockErr) {
      console.error('Stock decrement error:', stockErr);
    }

    // Clear Customer's Cart in MongoDB
    if (customerId) {
      try {
        await this.cartModel.findOneAndUpdate(
          { customerId },
          { items: [], totalItems: 0, totalAmount: 0 },
        );
      } catch (cartErr) {
        console.error('Cart clear error:', cartErr);
      }
    }

    return {
      message: 'Order placed successfully',
      orderId: savedOrder.orderId,
      order: savedOrder,
    };
  }

  // 🟢 2. GET ALL ORDERS FOR SPECIFIC CUSTOMER
  async findCustomerOrders(customerId) {
    return await this.orderModel
      .find({ customerId, isDeleted: false })
      .sort({ createdAt: -1 })
      .lean();
  }

  // 🟢 3. GET SINGLE ORDER DETAILS (By MongoDB _id OR orderId like "KC-729104")
  async findOne(identifier) {
    const cleanId = String(identifier).trim();

    const order = await this.orderModel
      .findOne({
        isDeleted: false,
        $or: [
          { orderId: cleanId },
          {
            _id: cleanId.match(/^[0-9a-fA-F]{24}$/) ? cleanId : null,
          },
        ],
      })
      .lean();

    if (!order) {
      throw new NotFoundException(`Order not found with: ${cleanId}`);
    }

    return order;
  }

  // 🟢 4. ADMIN: GET ALL ORDERS WITH PAGINATION & FILTER
  async findAll(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    if (query.status && query.status !== 'all') {
      filter.orderStatus = query.status;
    }

    if (query.search) {
      const searchRegex = new RegExp(String(query.search).trim(), 'i');
      filter.$or = [
        { orderId: searchRegex },
        { 'deliveryAddress.name': searchRegex },
        { 'deliveryAddress.phone': searchRegex },
      ];
    }

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  // 🟢 5. ADMIN: UPDATE ORDER (Order Status, Payment Status, Tracking, Courier)
  async updateStatus(
    id,
    { orderStatus, paymentStatus, trackingNumber, courierPartner },
  ) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const previousStatus = order.orderStatus;

    // Update fields
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus; // 👈 🟢 Saves payment status
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (courierPartner !== undefined) order.courierPartner = courierPartner;

    // If delivered via COD, auto-mark payment as 'paid'
    if (order.orderStatus === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    // Auto-restock items if order was cancelled
    if (order.orderStatus === 'cancelled' && previousStatus !== 'cancelled') {
      for (const it of order.items) {
        if (it.stockId) {
          await this.stockModel.findByIdAndUpdate(it.stockId, {
            $inc: { quantity: Number(it.quantity || 1) },
          });
        }
      }
    }

    await order.save();

    return {
      message: 'Order updated successfully',
      order,
    };
  }

  // 🟢 6. ADMIN: SOFT DELETE ORDER
  async delete(id) {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!order) throw new NotFoundException('Order not found');
    return { message: 'Order deleted successfully' };
  }
}
