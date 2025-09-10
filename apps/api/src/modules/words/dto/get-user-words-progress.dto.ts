import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class GetUserWordsProgressDto {
  constructor(progress: any) {
    this.userId = progress.userId || 0;
    this.languageId = progress.languageId;
    this.categoryId = progress.categoryId;
    this.pageSize = progress.pageSize || 10;
    this.page = progress.page || 1;
  }

  @ApiProperty({
    description: '用户 ID',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: '语言 ID',
    example: '1'
  })
  @IsString()
  @IsNotEmpty()
  languageId: string;

  @ApiProperty({
    description: '分类 ID',
    example: '1'
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: '分页大小',
    example: 10
  })
  @IsNumber()
  @IsNotEmpty()
  pageSize: number;

  @ApiProperty({
    description: '分页号',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;
}
