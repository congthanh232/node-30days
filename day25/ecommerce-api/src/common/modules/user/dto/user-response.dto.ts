// DTO đầu ra — định nghĩa những gì trả về cho client
export class UserResponseDto {
  id!: string;
  name!: string;
  email!: string;
  createdAt!: Date;
  // Không có password — không bao giờ trả password ra ngoài!

  // Chuyển đổi từ DB entity sang DTO sạch
  static fromEntity(user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
