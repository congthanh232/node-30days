import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  // Lưu refresh token tạm trong memory
  private refreshTokens: Map<string, string> = new Map();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Đăng ký user mới
  register(name: string, email: string, password: string) {
    return this.userService.create({ name, email, password });
  }

  // Đăng nhập
  async login(dto: LoginDto) {
    // Bước 1: Tìm user theo email
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Bước 2: So sánh password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Bước 3: Tạo tokens
    return this.generateTokens(user.id, user.email, user.role);
  }

  // Refresh access token
  async refresh(refreshToken: string) {
    // Bước 1: Kiểm tra refresh token có trong danh sách không
    const userId = this.refreshTokens.get(refreshToken);
    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Bước 2: Verify refresh token
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret',
      });
    } catch {
      this.refreshTokens.delete(refreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    // Bước 3: Lấy thông tin user và tạo access token mới
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    } satisfies JwtPayload);

    return { accessToken };
  }

  // Logout — xóa refresh token
  logout(refreshToken: string) {
    this.refreshTokens.delete(refreshToken);
    return { message: 'Logged out successfully' };
  }

  // Tạo cả 2 tokens
  private generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role } satisfies JwtPayload;

    // Access token — dùng config từ JwtModule
    const accessToken = this.jwtService.sign(payload);

    // Refresh token — dùng secret riêng
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret',
      expiresIn: '7d',
    });

    // Lưu refresh token vào memory
    this.refreshTokens.set(refreshToken, userId);

    return { accessToken, refreshToken };
  }
}
