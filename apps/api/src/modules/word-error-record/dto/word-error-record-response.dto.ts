import { ApiProperty } from '@nestjs/swagger';
import { WordErrorRecord } from '../entities/word-error-record.entity';

export class WordErrorRecordResponseDto {
  @ApiProperty({ description: '错词记录 ID', example: '1' })
  id: string;

  @ApiProperty({ description: '用户 ID', example: '1' })
  userId: string;

  @ApiProperty({ description: '单词 ID', example: '1' })
  wordId: string;

  @ApiProperty({ description: '分类 ID', example: '1' })
  categoryId: string;

  @ApiProperty({ description: '语言 ID', example: '1' })
  languageId: string;

  @ApiProperty({ description: '错误次数', example: 3 })
  errorCount: number;

  @ApiProperty({ description: '最后错误时间', example: '2024-01-01T00:00:00Z' })
  lastErrorTime: Date;

  @ApiProperty({ description: '首次错误时间', example: '2024-01-01T00:00:00Z' })
  firstErrorTime: Date;

  @ApiProperty({ description: '是否已练习过', example: false })
  isPracticed: boolean;

  @ApiProperty({ description: '练习次数', example: 2 })
  practiceCount: number;

  @ApiProperty({
    description: '最后练习时间',
    example: '2024-01-01T00:00:00Z',
    required: false
  })
  lastPracticeTime?: Date;

  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ description: '单词信息' })
  word: any;

  @ApiProperty({ description: '分类信息' })
  category: any;

  constructor(record: WordErrorRecord) {
    this.id = record.id;
    this.userId = record.userId;
    this.wordId = record.wordId;
    this.categoryId = record.categoryId;
    this.languageId = record.languageId;
    this.errorCount = record.errorCount;
    this.lastErrorTime = record.lastErrorTime;
    this.firstErrorTime = record.firstErrorTime;
    this.isPracticed = record.isPracticed;
    this.practiceCount = record.practiceCount;
    this.lastPracticeTime = record.lastPracticeTime;
    this.createdAt = record.createdAt;
    this.updatedAt = record.updatedAt;
    this.word = record.word;
    this.category = record.category;
  }
}

export class WordErrorRecordListResponseDto {
  @ApiProperty({
    description: '错词记录列表',
    type: [WordErrorRecordResponseDto]
  })
  list: WordErrorRecordResponseDto[];

  @ApiProperty({ description: '总数量', example: 100 })
  total: number;

  @ApiProperty({ description: '当前页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页数量', example: 20 })
  pageSize: number;

  @ApiProperty({ description: '总页数', example: 5 })
  totalPages: number;
}
