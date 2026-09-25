// customer-auth.guard.js
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Dependencies,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const ACCESS_SECRET =
  process.env.JWT_SECRET_KEY ||
  process.env.ACCESS_SECRET ||
  'MY_SUPER_SECRET_ACCESS_KEY_123';

@Injectable()
@Dependencies(JwtService)
export class CustomerAuthGuard {
  constructor(jwtService) {
    this.jwtService = jwtService;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Authentication token missing. Please sign in.',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: ACCESS_SECRET,
      });

      // 🟢 Verify this token belongs to a customer (or admin)
      if (
        payload.role &&
        payload.role !== 'customer' &&
        payload.role !== 'admin'
      ) {
        throw new ForbiddenException(
          'Access denied: Customer privileges required',
        );
      }

      // Attach user information to request
      request.user = payload;
      request.customerId = payload.sub || payload.id || payload._id;

      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Session expired. Please sign in again.',
        );
      }
      if (err instanceof ForbiddenException) {
        throw err;
      }
      throw new UnauthorizedException(
        'Invalid or malformed authentication token',
      );
    }
  }

  extractTokenFromHeader(request) {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
