import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryCustomWordDto {
  @ApiProperty({
    description: '学习包 ID',
    example: '1',
    required: true
  })
  @IsString({ message: '学习包 ID 必须是字符串' })
  packageId: string;

  @ApiProperty({
    description: '页码',
    example: 1,
    required: true
  })
  @IsNumber({}, { message: '页码必须是数字' })
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: true
  })
  @IsNumber({}, { message: '每页数量必须是数字' })
  @Transform(({ value }) => parseInt(value))
  pageSize: number = 10;

  @ApiProperty({
    description: '搜索关键词',
    example: 'hello',
    required: false
  })
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;
}
