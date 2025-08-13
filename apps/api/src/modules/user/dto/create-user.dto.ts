import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '用户名',
    example: '张三',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: '邮箱',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  password: string;

  @IsOptional()
  @ApiProperty({
    description: '是否激活',
    example: true,
    required: false,
  })
  isActive?: boolean;
}
