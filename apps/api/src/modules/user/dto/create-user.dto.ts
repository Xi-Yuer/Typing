import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      description: '用户名',
      example: '张三',
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      description: '密码',
      example: '123456',
    })
    password: string;
}
