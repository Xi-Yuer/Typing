import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWordErrorRecordDto {
  @ApiProperty({ description: '单词 ID', example: '1' })
  @IsNotEmpty()
  @IsString()
  wordId: string;

  @ApiProperty({ description: '分类 ID', example: '1' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ description: '语言 ID', example: '1' })
  @IsNotEmpty()
  @IsString()
  languageId: string;
}
