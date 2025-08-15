import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsInt, Min, Max } from 'class-validator';
import { CreateCorpusCategoryDto } from './create-corpus-category.dto';

export class UpdateCorpusCategoryDto extends PartialType(CreateCorpusCategoryDto) {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '分类名称长度不能超过100个字符' })
  @ApiProperty({
    description: '分类名称',
    example: '商务英语',
    maxLength: 100,
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '分类描述',
    example: '适合商务场景的英语学习内容',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsInt({ message: '难度等级必须是整数' })
  @Min(1, { message: '难度等级最小值为1' })
  @Max(5, { message: '难度等级最大值为5' })
  @ApiProperty({
    description: '难度等级',
    example: 3,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  difficulty?: number;
}