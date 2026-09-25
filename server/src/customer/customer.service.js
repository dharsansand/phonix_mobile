import {
  Injectable,
  Dependencies,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@Dependencies(getModelToken('Customer'), JwtService)
export class CustomerService {
  constructor(customerModel, jwtService) {
    this.customerModel = customerModel;
    this.jwtService = jwtService;
  }

  // 🟢 Generates JWT tokens specifically carrying role: 'customer'
  async generateTokens(customerId, email) {
    const payload = { sub: customerId, email, role: 'customer' };

    const accessSecret =
      process.env.ACCESS_SECRET || 'MY_SUPER_SECRET_ACCESS_KEY_123';
    const refreshSecret =
      process.env.REFRESH_SECRET || 'MY_SUPER_SECRET_REFRESH_KEY_456';
    const accessTime = process.env.ACCESS_SECRET_TIME || '1d';
    const refreshTime = process.env.REFRESH_SECRET_TIME || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessTime,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshTime,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // 🟢 Customer Sign Up (/customer/signup)
  async signup(customerData) {
    const existing = await this.customerModel.findOne({
      email: customerData.email.trim().toLowerCase(),
      isdelete: false,
    });

    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(customerData.password, salt);

    const newCustomer = new this.customerModel({
      ...customerData,
      email: customerData.email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'customer',
    });

    const savedCustomer = await newCustomer.save();
    const tokens = await this.generateTokens(
      savedCustomer._id,
      savedCustomer.email,
    );

    savedCustomer.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await savedCustomer.save();

    return {
      message: 'Customer registered successfully',
      user: {
        id: savedCustomer._id,
        name: savedCustomer.name,
        email: savedCustomer.email,
        phone: savedCustomer.phone,
        role: savedCustomer.role,
      },
      ...tokens,
    };
  }

  async login({ email, password }) {
    const customer = await this.customerModel.findOne({ email: email }).exec();

    if (!customer) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(customer._id, customer.email);

    customer.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await customer.save();

    return {
      message: 'Login successful',
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role || 'customer',
      },
      ...tokens,
    };
  }

  // 🟢 Get Current Customer Profile (/customer/me)
  async getMe(customerId) {
    const customer = await this.customerModel
      .findById(customerId)
      .select('-password -refreshToken')
      .exec();

    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }

    return customer;
  }

  // 🟢 Refresh Customer Tokens (/customer/refresh)
  async refreshTokens(customerId, refreshToken) {
    const refreshSecret =
      process.env.REFRESH_SECRET || 'MY_SUPER_SECRET_REFRESH_KEY_456';

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Session expired. Please login again.');
    }

    const customer = await this.customerModel.findById(customerId).exec();
    if (!customer || !customer.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const isTokenMatch = await bcrypt.compare(
      refreshToken,
      customer.refreshToken,
    );
    if (!isTokenMatch) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(customer._id, customer.email);

    customer.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await customer.save();

    return tokens;
  }

  // 🟢 Logout Customer (/customer/logout)
  async logout(customerId) {
    await this.customerModel.findByIdAndUpdate(customerId, {
      refreshToken: null,
    });
    return { message: 'Logged out successfully' };
  }

  async findAll() {
    return await this.customerModel
      .find({ isdelete: false })
      .select('-password -refreshToken')
      .exec();
  }

  async findOne(id) {
    return await this.customerModel
      .findById(id)
      .select('-password -refreshToken')
      .exec();
  }

  async saveAddress(customerId, addressData) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    const newAddress = {
      name: addressData.name,
      phone: addressData.phone,
      email: addressData.email || customer.email,
      streetAddress: addressData.address || addressData.streetAddress,
      city: addressData.city,
      state: addressData.state || 'Tamil Nadu',
      pincode: addressData.pincode,
      isDefault: addressData.isDefault ?? customer.savedAddresses.length === 0,
    };

    // If customer sets this as default, unset other defaults
    if (newAddress.isDefault) {
      customer.savedAddresses.forEach((addr) => (addr.isDefault = false));
    }

    // Push new address to the savedAddresses list
    customer.savedAddresses.push(newAddress);

    // Get the newly added address _id
    const addedAddress =
      customer.savedAddresses[customer.savedAddresses.length - 1];

    // Automatically set as active selected address
    customer.selectedAddressId = addedAddress._id;

    await customer.save();

    return {
      message: 'Address saved successfully',
      selectedAddressId: customer.selectedAddressId,
      savedAddresses: customer.savedAddresses,
    };
  }

  // 🟢 2. SELECT an active address from saved list (for Checkout)
  async selectAddress(customerId, addressId) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    const addressExists = customer.savedAddresses.some(
      (addr) => String(addr._id) === String(addressId),
    );

    if (!addressExists) {
      throw new NotFoundException(
        'Selected address not found in saved addresses',
      );
    }

    customer.selectedAddressId = addressId;
    await customer.save();

    return {
      message: 'Address selected successfully',
      selectedAddressId: customer.selectedAddressId,
    };
  }

  // 🟢 3. GET all saved addresses + active address
  async getAddresses(customerId) {
    const customer = await this.customerModel
      .findById(customerId)
      .select('savedAddresses selectedAddressId')
      .lean();

    if (!customer) throw new NotFoundException('Customer not found');

    const activeAddress =
      customer.savedAddresses.find(
        (addr) => String(addr._id) === String(customer.selectedAddressId),
      ) ||
      customer.savedAddresses[0] ||
      null;

    return {
      selectedAddress: activeAddress,
      selectedAddressId: customer.selectedAddressId,
      addresses: customer.savedAddresses || [],
    };
  }

  // 🟢 4. DELETE a saved address
  async deleteAddress(customerId, addressId) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    customer.savedAddresses = customer.savedAddresses.filter(
      (addr) => String(addr._id) !== String(addressId),
    );

    // If selected address was deleted, reset selectedAddressId to first remaining address
    if (String(customer.selectedAddressId) === String(addressId)) {
      customer.selectedAddressId = customer.savedAddresses[0]?._id || null;
    }

    await customer.save();

    return {
      message: 'Address deleted successfully',
      savedAddresses: customer.savedAddresses,
    };
  }
}
