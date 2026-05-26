import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO đầu vào khi login
export class LoginDto {
  @ApiProperty({ example: 'john@gmail.com', description: 'User email' })
  // Email phải đúng format
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Password min 6 characters',
    minLength: 6,
  })
  // Password tối thiểu 6 ký tự
  @IsString()
  @MinLength(6)
  password!: string;
}
