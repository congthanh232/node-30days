import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Payload được lưu trong JWT token
export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Đọc token từ header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Tự động reject token hết hạn
      ignoreExpiration: false,
      // Secret key để verify token
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'fallback-secret',
    });
  }

  // Chạy sau khi verify token thành công
  // Kết quả trả về sẽ được gắn vào request.user
  validate(payload: JwtPayload) {
    console.log('JWT payload:', payload);
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
