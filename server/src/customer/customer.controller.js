import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Dependencies,
  Bind,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from '../users/auth.guard'; // Adjust relative path to your auth.guard

@Controller('customer')
@Dependencies(CustomerService)
export class CustomerController {
  constructor(customerService) {
    this.customerService = customerService;
  }

  // 🟢 1. Customer Sign Up (Matches your frontend /customer/signup)
  @Post('signup')
  @Bind(Body())
  signup(customerData) {
    return this.customerService.signup(customerData);
  }

  // 🟢 2. Customer Sign In (Matches your frontend /customer/login)
  @Post('login')
  @Bind(Body())
  login(loginData) {
    return this.customerService.login(loginData);
  }

  // 🟢 3. Current Authenticated Customer Profile
  @UseGuards(AuthGuard)
  @Get('me')
  @Bind(Req())
  getMe(req) {
    return this.customerService.getMe(req.user.sub || req.userId);
  }

  // 🟢 4. Refresh Customer Token
  @Post('refresh')
  @Bind(Body())
  refreshTokens(body) {
    return this.customerService.refreshTokens(body.userId, body.refreshToken);
  }
  @Post('address/:customerId')
  @Bind(Param('customerId'), Body())
  saveAddress(customerId, body) {
    return this.customerService.saveAddress(customerId, body);
  }
  // 🟢 5. Customer Logout
  @Post('logout')
  @Bind(Body())
  logout(body) {
    return this.customerService.logout(body.userId);
  }

  // 🟢 6. Admin view of all customers
  @Get()
  getAllCustomers() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @Bind(Param('id'))
  getCustomerById(id) {
    return this.customerService.findOne(id);
  }

  @Patch('address/select/:customerId')
  @Bind(Param('customerId'), Body())
  selectAddress(customerId, body) {
    return this.customerService.selectAddress(customerId, body.addressId);
  }

  @Get('address/:customerId')
  @Bind(Param('customerId'))
  getAddresses(customerId) {
    return this.customerService.getAddresses(customerId);
  }

  @Delete('address/:customerId/:addressId')
  @Bind(Param('customerId'), Param('addressId'))
  deleteAddress(customerId, addressId) {
    return this.customerService.deleteAddress(customerId, addressId);
  }
}
