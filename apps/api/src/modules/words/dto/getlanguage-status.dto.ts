import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetLanguageStatusDto {
  @ApiProperty({ description: '语言 ID', example: '1' })
  @IsString()
  @IsNotEmpty()
  languageId: string;

  @ApiProperty({ description: '语言状态', example: 'active' })
  @IsString()
  @IsNotEmpty()
  languageStatus: string;

  @ApiProperty({ description: '页码', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  pageSize: number;
}

export class GetCategoryStatusDto {
  @ApiProperty({ description: '分类 ID', example: '1' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: '分类状态', example: 'active' })
  @IsString()
  @IsNotEmpty()
  categoryStatus: string;

  @ApiProperty({ description: '页码', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  pageSize: number;
}
