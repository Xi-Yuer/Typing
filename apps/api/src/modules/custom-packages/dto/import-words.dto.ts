import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsUrl,
  IsInt,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImportWordItemDto {
  @ApiProperty({ description: '单词原文', example: 'hello' })
  @IsNotEmpty({ message: '单词不能为空' })
  @IsString({ message: '单词必须是字符串' })
  @MaxLength(255, { message: '单词长度不能超过255个字符' })
  word: string;

  @ApiProperty({
    description: '罗马音/拼音',
    example: 'hə-ˈlō',
    required: false
  })
  @IsOptional()
  @IsString({ message: '罗马音/拼音必须是字符串' })
  @MaxLength(255, { message: '罗马音/拼音长度不能超过255个字符' })
  transliteration?: string;

  @ApiProperty({
    description: '音标',
    example: '/həˈloʊ/',
    required: false
  })
  @IsOptional()
  @IsString({ message: '音标必须是字符串' })
  @MaxLength(255, { message: '音标长度不能超过255个字符' })
  pronunciation?: string;

  @ApiProperty({
    description: '美式音标',
    example: '/həˈloʊ/',
    required: false
  })
  @IsOptional()
  @IsString({ message: '美式音标必须是字符串' })
  @MaxLength(255, { message: '美式音标长度不能超过255个字符' })
  usPhonetic?: string;

  @ApiProperty({
    description: '英式音标',
    example: '/həˈləʊ/',
    required: false
  })
  @IsOptional()
  @IsString({ message: '英式音标必须是字符串' })
  @MaxLength(255, { message: '英式音标长度不能超过255个字符' })
  ukPhonetic?: string;

  @ApiProperty({
    description: '中文释义',
    example: '你好；问候',
    required: false
  })
  @IsOptional()
  @IsString({ message: '中文释义必须是字符串' })
  meaning?: string;

  @ApiProperty({
    description: '翻译',
    example: '你好；问候',
    required: false
  })
  @IsOptional()
  @IsString({ message: '翻译必须是字符串' })
  translation?: string;

  @ApiProperty({
    description: '简短翻译',
    example: '你好',
    required: false
  })
  @IsOptional()
  @IsString({ message: '简短翻译必须是字符串' })
  meaningShort?: string;

  @ApiProperty({
    description: '例句',
    example: 'Hello, how are you?',
    required: false
  })
  @IsOptional()
  @IsString({ message: '例句必须是字符串' })
  example?: string;

  @ApiProperty({
    description: '发音音频链接',
    example: 'https://example.com/audio/hello.mp3',
    required: false
  })
  @IsOptional()
  @IsString({ message: '音频链接必须是字符串' })
  @IsUrl({}, { message: '音频链接格式不正确' })
  @MaxLength(255, { message: '音频链接长度不能超过255个字符' })
  audioUrl?: string;

  @ApiProperty({
    description: '图片链接',
    example: 'https://example.com/images/hello.jpg',
    required: false
  })
  @IsOptional()
  @IsString({ message: '图片链接必须是字符串' })
  @IsUrl({}, { message: '图片链接格式不正确' })
  @MaxLength(255, { message: '图片链接长度不能超过255个字符' })
  imageUrl?: string;

  @ApiProperty({
    description: '排序权重',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsInt({ message: '排序权重必须是整数' })
  @Min(0, { message: '排序权重不能小于0' })
  sortOrder?: number;

  @ApiProperty({
    description: '难度等级',
    example: 'medium',
    required: false
  })
  @IsOptional()
  @IsString({ message: '难度等级必须是字符串' })
  @MaxLength(50, { message: '难度等级长度不能超过50个字符' })
  difficulty?: string;

  @ApiProperty({
    description: '分类',
    example: 'default',
    required: false
  })
  @IsOptional()
  @IsString({ message: '分类必须是字符串' })
  @MaxLength(100, { message: '分类长度不能超过100个字符' })
  category?: string;

  @ApiProperty({
    description: '学习包ID',
    example: 'package-id-123',
    required: false
  })
  @IsOptional()
  @IsString({ message: '学习包ID必须是字符串' })
  @MaxLength(255, { message: '学习包ID长度不能超过255个字符' })
  packageId?: string;
}

export class ImportWordsDto {
  @ApiProperty({
    description: '要导入的单词列表',
    type: [ImportWordItemDto]
  })
  @IsArray({ message: '单词列表必须是数组' })
  @ValidateNested({ each: true })
  @Type(() => ImportWordItemDto)
  words: ImportWordItemDto[];
}
