import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryWordErrorRecordDto {
  @ApiProperty({ description: '分类 ID', example: '1', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ description: '语言 ID', example: '1', required: false })
  @IsOptional()
  @IsString()
  languageId?: string;

  @ApiProperty({ description: '是否已练习过', example: false, required: false })
  @IsOptional()
  isPracticed?: boolean;

  @ApiProperty({ description: '页码', example: 1, minimum: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 20,
    minimum: 1,
    maximum: 100,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiProperty({
    description: '排序字段',
    example: 'lastErrorTime',
    required: false
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'lastErrorTime';

  @ApiProperty({
    description: '排序方向',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    required: false
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
