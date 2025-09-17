import { ApiProperty } from '@nestjs/swagger';

export class CategoryStatDto {
  @ApiProperty({ description: '分类ID', example: '131' })
  categoryId: string;

  @ApiProperty({ description: '分类名称', example: '新东方初中词汇' })
  categoryName: string;

  @ApiProperty({ description: '错误次数', example: 2 })
  errorCount: number;

  @ApiProperty({ description: '错误单词数', example: 1 })
  wordCount: number;
}

export class LanguageStatDto {
  @ApiProperty({ description: '语言ID', example: '0' })
  languageId: string;

  @ApiProperty({ description: '语言名称', example: '英语' })
  languageName: string;

  @ApiProperty({ description: '错误次数', example: 45 })
  errorCount: number;

  @ApiProperty({ description: '错误单词数', example: 15 })
  wordCount: number;
}

export class WordErrorStatisticsDto {
  @ApiProperty({ description: '总错误次数', example: 45 })
  totalErrors: number;

  @ApiProperty({
    type: [CategoryStatDto],
    example: [
      {
        categoryId: '131',
        categoryName: '新东方初中词汇',
        errorCount: 2,
        wordCount: 1
      }
    ]
  })
  categoryStats: CategoryStatDto[];

  @ApiProperty({
    description: '语言统计',
    type: [LanguageStatDto],
    example: [
      {
        languageId: '0',
        languageName: '英语',
        errorCount: 45,
        wordCount: 15
      }
    ]
  })
  languageStats: LanguageStatDto[];
}

export class WordErrorStatisticsResponseDto {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '响应消息', example: '操作成功' })
  message: string;

  @ApiProperty({
    description: '统计数据',
    type: WordErrorStatisticsDto
  })
  data: WordErrorStatisticsDto;

  @ApiProperty({ description: '时间戳', example: 1758100089097 })
  timestamp: number;

  @ApiProperty({
    description: '请求路径',
    example: '/api/word-error-records/statistics'
  })
  path: string;
}
