import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Dependencies,
  Bind,
} from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
@Dependencies(OrderService)
export class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  // 🟢 1. Place New Order (POST /order)
  @Post()
  @Bind(Body())
  createOrder(orderData) {
    return this.orderService.createOrder(orderData);
  }

  // 🟢 2. Admin: Get All Orders (GET /order?page=1&limit=10&status=placed)
  @Get()
  @Bind(Query())
  getAllOrders(query) {
    return this.orderService.findAll(query);
  }

  // 🟢 3. Customer: Get My Orders (GET /order/customer/:customerId)
  @Get('customer/:customerId')
  @Bind(Param('customerId'))
  getCustomerOrders(customerId) {
    return this.orderService.findCustomerOrders(customerId);
  }

  // 🟢 4. Single Order Details by ID (GET /order/:id)
  @Get(':id')
  @Bind(Param('id'))
  getOrderDetails(id) {
    return this.orderService.findOne(id);
  }

  // 🟢 5. Admin: Update Order Status & Payment (PATCH /order/status/:id)
  @Patch('status/:id')
  @Bind(Param('id'), Body())
  updateOrderStatus(id, body) {
    return this.orderService.updateStatus(id, body);
  }

  // 🟢 6. Admin: Soft Delete Order (DELETE /order/:id)
  @Delete(':id')
  @Bind(Param('id'))
  deleteOrder(id) {
    return this.orderService.delete(id);
  }
}
