import { 
  Injectable, 
  Dependencies, 
  UnauthorizedException, 
  ForbiddenException 
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt'; 

@Injectable()
@Dependencies(getModelToken('User'), JwtService) 
export class UsersService {
  constructor(userModel, jwtService) {
    this.userModel = userModel;
    this.jwtService = jwtService;
  }

async generateTokens(userId, email) {
    const payload = { sub: userId, email };

    // Fallbacks guarantee the secret is NEVER undefined
    const accessSecret = process.env.ACCESS_SECRET || 'MY_SUPER_SECRET_ACCESS_KEY_123';
    const refreshSecret = process.env.REFRESH_SECRET || 'MY_SUPER_SECRET_REFRESH_KEY_456';
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

  async create(userData) {
    const existingUser = await this.userModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const tokens = await this.generateTokens(savedUser._id, savedUser.email);
  
    savedUser.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await savedUser.save();

    return {
      message: 'User registered successfully',
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
      ...tokens,
    };
  }

  async login({ email, password }) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user._id, user.email);

    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await user.save();

    return {
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async getMe(userId) {
    const user = await this.userModel.findById(userId).select('-password -refreshToken').exec();
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async refreshTokens(userId, refreshToken) {
    const refreshSecret = process.env.REFRESH_SECRET || 'MY_SUPER_SECRET_REFRESH_KEY_456';

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Session expired. Please login again.');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const isTokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isTokenMatch) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user._id, user.email);

    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await user.save();

    return tokens;
  }

  async logout(userId) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id) {
    return await this.userModel.findById(id).exec();
  }

  async update(id, updateData) {
    return await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}