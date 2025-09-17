import { ApiProperty } from '@nestjs/swagger';

/**
 * 有错词的分类统计信息 DTO
 */
export class CategoryWithErrorsDto {
  @ApiProperty({ description: '分类 ID', example: '1' })
  id: string;

  @ApiProperty({ description: '分类名称', example: '日常会话' })
  name: string;

  @ApiProperty({
    description: '分类描述',
    example: '包含日常生活中的基本对话场景'
  })
  description: string;

  @ApiProperty({ description: '难度等级', example: 3 })
  difficulty: number;

  @ApiProperty({ description: '语言 ID', example: '1' })
  languageId: string;

  @ApiProperty({ description: '语言名称', example: '英语' })
  languageName: string;

  @ApiProperty({ description: '错误次数总计', example: 15 })
  errorCount: number;

  @ApiProperty({ description: '错词数量', example: 8 })
  wordCount: number;

  @ApiProperty({ description: '未练习的错词数量', example: 5 })
  unPracticedCount: number;

  constructor(data: any) {
    this.id = data.categoryId;
    this.name = data.categoryName;
    this.description = data.categoryDescription;
    this.difficulty = data.difficulty;
    this.languageId = data.languageId;
    this.languageName = data.languageName;
    this.errorCount = parseInt(data.errorCount) || 0;
    this.wordCount = parseInt(data.wordCount) || 0;
    this.unPracticedCount = parseInt(data.unPracticedCount) || 0;
  }
}
