import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

// Tạm thời dùng in-memory array thay DB
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
}

@Injectable()
export class UserService {
  // Lưu tạm trong memory
  private users: User[] = [];

  // Tạo user mới
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    // Kiểm tra email đã tồn tại chưa
    const existing = this.users.find((u) => u.email === dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // Hash password trước khi lưu
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Tạo user mới
    const user: User = {
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    };

    this.users.push(user);

    // Trả về DTO sạch — không có password
    return UserResponseDto.fromEntity(user);
  }

  // Lấy danh sách user có pagination + search
  findAll(query: QueryUserDto): {
    data: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    let filtered = [...this.users];

    // Tìm kiếm theo tên hoặc email
    if (query.search) {
      const search = query.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search),
      );
    }

    // Sắp xếp theo createdAt mới nhất
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Tính pagination
    const total = filtered.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Cắt đúng trang, dùng arrow function thay vì method reference
    const data = filtered
      .slice(skip, skip + limit)
      .map((u) => UserResponseDto.fromEntity(u));

    return { data, total, page, limit, totalPages };
  }

  // Tìm user theo id
  findOne(id: string): UserResponseDto {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return UserResponseDto.fromEntity(user);
  }

  // Tìm user theo email — trả về cả password để verify
  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  // Tìm user theo id — trả về cả password
  findById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }
}
