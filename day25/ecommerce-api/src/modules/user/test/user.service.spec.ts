import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

// Mock PrismaService
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw ConflictException if email already exists', async () => {
      // Arrange — giả lập email đã tồn tại
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'john@gmail.com',
      });

      // Act + Assert
      await expect(
        userService.create({
          name: 'John',
          email: 'john@gmail.com',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user successfully', async () => {
      // Arrange — giả lập email chưa tồn tại
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        name: 'John',
        email: 'john@gmail.com',
        role: 'user',
        createdAt: new Date(),
      });

      // Act
      const result = await userService.create({
        name: 'John',
        email: 'john@gmail.com',
        password: '123456',
      });

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email', 'john@gmail.com');
      expect(result).not.toHaveProperty('password'); // password không được trả về
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(userService.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return user if found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        name: 'John',
        email: 'john@gmail.com',
        role: 'user',
        createdAt: new Date(),
      });

      const result = await userService.findOne('1');
      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('email', 'john@gmail.com');
    });
  });
});
