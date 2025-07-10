import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninUserDto {
  @ApiProperty({ example: 'ali@gmail.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
