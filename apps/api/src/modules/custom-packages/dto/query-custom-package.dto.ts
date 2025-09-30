import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryCustomPackageDto {
  @ApiProperty({
    description: '页码',
    example: 1,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiProperty({
    description: '搜索关键词',
    example: '英语',
    required: false
  })
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;

  @ApiProperty({
    description: '语言',
    example: '英语',
    required: false
  })
  @IsOptional()
  @IsString({ message: '语言必须是字符串' })
  language?: string;

  @ApiProperty({
    description: '是否只显示公开的学习包',
    example: true,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: '是否公开必须是布尔值' })
  isPublic?: boolean;
}
