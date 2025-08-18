import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Language } from '../../languages/entities/language.entity';
import { CorpusCategory } from '../../corpus-categories/entities/corpus-category.entity';

@Entity('sentences')
export class Sentence {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @ApiProperty({ description: '句子 ID', example: '1' })
  id: string;

  @Column({ name: 'language_id', type: 'bigint' })
  @ApiProperty({ description: '所属语言 ID', example: '1' })
  languageId: string;

  @Column({ name: 'category_id', type: 'bigint' })
  @ApiProperty({ description: '所属分类 ID', example: '1' })
  categoryId: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: '句子原文',
    example: 'Hello, how are you today?'
  })
  sentence: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: '中文释义', example: '你好，你今天怎么样？' })
  meaning: string;

  @Column({ name: 'audio_url', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: '句子音频 URL',
    example: 'https://example.com/audio/sentence1.mp3',
    required: false
  })
  audioUrl?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  @ApiProperty({
    description: '删除时间',
    example: '2024-01-01T00:00:00Z',
    required: false
  })
  deletedAt?: Date;

  // 关联关系
  @ManyToOne(() => Language, { eager: false })
  @JoinColumn({ name: 'language_id' })
  @ApiProperty({ description: '所属语言', type: () => Language })
  language: Language;

  @ManyToOne(() => CorpusCategory, { eager: false })
  @JoinColumn({ name: 'category_id' })
  @ApiProperty({ description: '所属分类', type: () => CorpusCategory })
  category: CorpusCategory;
}
