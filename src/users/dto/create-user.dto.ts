import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali Valiyev', description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'ali@gmail.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: 'admin',
    enum: ['super_admin', 'admin', 'manager', 'client'],
    description: 'User role',
  })
  @IsEnum(['super_admin', 'admin', 'manager', 'client'])
  role: 'super_admin' | 'admin' | 'manager' | 'client';
}
