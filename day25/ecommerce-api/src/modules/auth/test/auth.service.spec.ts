import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock UserService
const mockUserService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

// Mock JwtService
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    // Reset mock trước mỗi test
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange — giả lập không tìm thấy user
      mockUserService.findByEmail.mockResolvedValue(null);

      // Act + Assert
      await expect(
        authService.login({ email: 'test@gmail.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password wrong', async () => {
      // Arrange — giả lập tìm thấy user nhưng password sai
      mockUserService.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@gmail.com',
        password: await bcrypt.hash('correct-password', 10),
        role: 'user',
      });

      // Act + Assert
      await expect(
        authService.login({
          email: 'test@gmail.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens if login success', async () => {
      // Arrange — giả lập tìm thấy user và password đúng
      const hashedPassword = await bcrypt.hash('123456', 10);
      mockUserService.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@gmail.com',
        password: hashedPassword,
        role: 'user',
      });

      // Act
      const result = await authService.login({
        email: 'test@gmail.com',
        password: '123456',
      });

      // Assert
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('logout', () => {
    it('should return success message', () => {
      const result = authService.logout('some-refresh-token');
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
