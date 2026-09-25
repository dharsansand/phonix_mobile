// auth.guard.js
import {
  Injectable,
  UnauthorizedException,
  Dependencies,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const ACCESS_SECRET =
  process.env.JWT_SECRET_KEY ||
  process.env.ACCESS_SECRET ||
  'MY_SUPER_SECRET_ACCESS_KEY_123';

@Injectable()
@Dependencies(JwtService)
export class AuthGuard { 
  constructor(jwtService) {
    this.jwtService = jwtService;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: ACCESS_SECRET,
      });

      request.user = payload;
      request.userId = payload.sub || payload.id;

      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid or malformed token');
    }
  }

  extractTokenFromHeader(request) {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}