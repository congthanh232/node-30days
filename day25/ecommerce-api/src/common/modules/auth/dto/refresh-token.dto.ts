import { IsString, IsNotEmpty } from 'class-validator';

// DTO đầu vào khi client muốn lấy access token mới
export class RefreshTokenDto {
  // Refresh token client gửi lên
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
