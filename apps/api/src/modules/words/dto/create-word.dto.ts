import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUrl,
  IsNumberString,
} from 'class-validator';

export class CreateWordDto {
  @ApiProperty({ description: '所属语言 ID', example: '1' })
  @IsNotEmpty({ message: '语言 ID 不能为空' })
  @IsNumberString({}, { message: '语言 ID 必须是数字字符串' })
  languageId: string;

  @ApiProperty({ description: '所属分类 ID', example: '1' })
  @IsNotEmpty({ message: '分类 ID 不能为空' })
  @IsNumberString({}, { message: '分类 ID 必须是数字字符串' })
  categoryId: string;

  @ApiProperty({ description: '单词原文', example: 'hello' })
  @IsNotEmpty({ message: '单词不能为空' })
  @IsString({ message: '单词必须是字符串' })
  @MaxLength(255, { message: '单词长度不能超过255个字符' })
  word: string;

  @ApiProperty({ description: '罗马音/拼音', example: 'hə-ˈlō', required: false })
  @IsOptional()
  @IsString({ message: '罗马音/拼音必须是字符串' })
  @MaxLength(255, { message: '罗马音/拼音长度不能超过255个字符' })
  transliteration?: string;

  @ApiProperty({ description: '美式音标', example: '/həˈloʊ/', required: false })
  @IsOptional()
  @IsString({ message: '美式音标必须是字符串' })
  @MaxLength(255, { message: '美式音标长度不能超过255个字符' })
  usPhonetic?: string;

  @ApiProperty({ description: '英式音标', example: '/həˈləʊ/', required: false })
  @IsOptional()
  @IsString({ message: '英式音标必须是字符串' })
  @MaxLength(255, { message: '英式音标长度不能超过255个字符' })
  ukPhonetic?: string;

  @ApiProperty({ description: '中文释义', example: '你好；问候' })
  @IsNotEmpty({ message: '中文释义不能为空' })
  @IsString({ message: '中文释义必须是字符串' })
  meaning: string;

  @ApiProperty({ description: '例句', example: 'Hello, how are you?' })
  @IsNotEmpty({ message: '例句不能为空' })
  @IsString({ message: '例句必须是字符串' })
  example: string;

  @ApiProperty({ description: '发音音频链接', example: 'https://example.com/audio/hello.mp3', required: false })
  @IsOptional()
  @IsString({ message: '音频链接必须是字符串' })
  @IsUrl({}, { message: '音频链接格式不正确' })
  @MaxLength(255, { message: '音频链接长度不能超过255个字符' })
  audioUrl?: string;

  @ApiProperty({ description: '图片链接', example: 'https://example.com/images/hello.jpg', required: false })
  @IsOptional()
  @IsString({ message: '图片链接必须是字符串' })
  @IsUrl({}, { message: '图片链接格式不正确' })
  @MaxLength(255, { message: '图片链接长度不能超过255个字符' })
  imageUrl?: string;
}