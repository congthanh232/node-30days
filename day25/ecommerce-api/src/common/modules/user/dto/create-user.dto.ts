import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
// DTO đầu vào — định nghĩa client phải gửi lên những gì khi tạo user
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
