import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  // Tạo user mới
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    // Kiểm tra email đã tồn tại chưa
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // Hash password trước khi lưu
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Tạo user mới trong DB
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: 'user',
      },
    });

    // Trả về DTO sạch — không có password
    return UserResponseDto.fromEntity(user);
  }

  // Lấy danh sách user có pagination + search
  async findAll(query: QueryUserDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    // Điều kiện search
    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { email: { contains: query.search } },
          ],
        }
      : {};

    // Chạy 2 query song song — lấy data và đếm total
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => UserResponseDto.fromEntity(u)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Tìm user theo id
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return UserResponseDto.fromEntity(user);
  }

  // Tìm user theo email — trả về cả password để verify
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  // Tìm user theo id — trả về cả password
  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }
}
