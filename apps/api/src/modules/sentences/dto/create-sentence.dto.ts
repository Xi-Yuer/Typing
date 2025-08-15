import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateSentenceDto {
  @ApiProperty({
    description: '所属语言 ID',
    example: '1',
  })
  @IsNotEmpty({ message: '语言 ID 不能为空' })
  @IsString({ message: '语言 ID 必须是字符串' })
  languageId: string;

  @ApiProperty({
    description: '所属分类 ID',
    example: '1',
  })
  @IsNotEmpty({ message: '分类 ID 不能为空' })
  @IsString({ message: '分类 ID 必须是字符串' })
  categoryId: string;

  @ApiProperty({
    description: '句子原文',
    example: 'Hello, how are you today?',
  })
  @IsNotEmpty({ message: '句子原文不能为空' })
  @IsString({ message: '句子原文必须是字符串' })
  sentence: string;

  @ApiProperty({
    description: '中文释义',
    example: '你好，你今天怎么样？',
  })
  @IsNotEmpty({ message: '中文释义不能为空' })
  @IsString({ message: '中文释义必须是字符串' })
  meaning: string;

  @ApiProperty({
    description: '句子音频 URL',
    example: 'https://example.com/audio/sentence1.mp3',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: '音频 URL 格式不正确' })
  @MaxLength(255, { message: '音频 URL 长度不能超过 255 个字符' })
  audioUrl?: string;
}