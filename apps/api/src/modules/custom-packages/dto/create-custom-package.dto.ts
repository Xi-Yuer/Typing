import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean
} from 'class-validator';

export class CreateCustomPackageDto {
  @ApiProperty({ description: '学习包名称', example: '我的英语单词包' })
  @IsNotEmpty({ message: '学习包名称不能为空' })
  @IsString({ message: '学习包名称必须是字符串' })
  @MaxLength(255, { message: '学习包名称长度不能超过255个字符' })
  name: string;

  @ApiProperty({
    description: '学习包描述',
    example: '包含常用英语单词的学习包',
    required: false
  })
  @IsOptional()
  @IsString({ message: '学习包描述必须是字符串' })
  description?: string;

  @ApiProperty({
    description: '是否公开',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: '是否公开必须是布尔值' })
  isPublic?: boolean;
}
