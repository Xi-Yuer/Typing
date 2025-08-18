import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength
} from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: '语言名称',
    example: 'English',
    maxLength: 50
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @ApiProperty({
    description: '语言代码',
    example: 'en',
    maxLength: 10
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: '文字体系',
    example: 'Latin',
    maxLength: 50
  })
  script: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: '是否启用',
    example: true,
    default: true,
    required: false
  })
  isActive?: boolean;
}
