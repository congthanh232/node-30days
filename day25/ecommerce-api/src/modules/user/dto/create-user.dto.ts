import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// DTO đầu vào — định nghĩa client phải gửi lên những gì khi tạo user
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john@gmail.com', description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Password min 6 characters',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
