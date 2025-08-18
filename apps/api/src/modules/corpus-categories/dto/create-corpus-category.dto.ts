import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsNumberString
} from 'class-validator';

export class CreateCorpusCategoryDto {
  @ApiProperty({
    description: '对应语言 ID',
    example: '1'
  })
  @IsNotEmpty({ message: '语言 ID 不能为空' })
  @IsNumberString({}, { message: '语言 ID 必须是数字字符串' })
  languageId: string;

  @ApiProperty({
    description: '分类名称（旅游、商务、日常会话）',
    example: '日常会话',
    maxLength: 100
  })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @IsString({ message: '分类名称必须是字符串' })
  @MaxLength(100, { message: '分类名称长度不能超过100个字符' })
  name: string;

  @ApiProperty({
    description: '分类描述',
    example: '包含日常生活中的基本对话场景',
    required: false
  })
  @IsOptional()
  @IsString({ message: '分类描述必须是字符串' })
  description?: string;

  @ApiProperty({
    description: '难度等级（1-5）',
    example: 3,
    minimum: 1,
    maximum: 5
  })
  @IsNotEmpty({ message: '难度等级不能为空' })
  @IsInt({ message: '难度等级必须是整数' })
  @Min(1, { message: '难度等级最小值为1' })
  @Max(5, { message: '难度等级最大值为5' })
  difficulty: number;
}
