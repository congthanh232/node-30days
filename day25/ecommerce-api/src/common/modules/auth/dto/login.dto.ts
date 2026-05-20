import { IsEmail, IsString, MinLength } from 'class-validator';

// DTO đầu vào khi login
export class LoginDto {
  // Email phải đúng format
  @IsEmail()
  email!: string;

  // Password tối thiểu 6 ký tự
  @IsString()
  @MinLength(6)
  password!: string;
}
