import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

// Mock PrismaService
const mockPrisma = {
  product: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
};

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Áo thun nam',
  description: 'Áo thun cotton',
  price: new Decimal(150000),
  stock: 100,
  category: 'fashion',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create product successfully', async () => {
      mockPrisma.product.create.mockResolvedValue(mockProduct);

      const result = await productService.create({
        name: 'Áo thun nam',
        price: 150000,
        stock: 100,
        category: 'fashion',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Áo thun nam');
      expect(result).toHaveProperty('price', 150000);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(productService.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return product if found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

      const result = await productService.findOne('1');
      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('price', 150000);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(productService.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete product successfully', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.product.delete.mockResolvedValue(mockProduct);

      const result = await productService.remove('1');
      expect(result).toHaveProperty('message');
    });
  });
});
