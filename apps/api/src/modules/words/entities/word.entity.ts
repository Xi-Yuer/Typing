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

@Entity('words')
export class Word {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @ApiProperty({ description: '单词 ID', example: '1' })
  id: string;

  @Column({ name: 'language_id', type: 'bigint' })
  @ApiProperty({ description: '所属语言 ID', example: 'en' })
  languageId: string;

  @Column({ name: 'category_id', type: 'bigint' })
  @ApiProperty({ description: '所属分类 ID', example: '1' })
  categoryId: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '单词原文', example: 'hello' })
  word: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '罗马音/拼音', example: 'hə-ˈlō', required: false })
  transliteration?: string;

  @Column({ name: 'us_phonetic', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '美式音标', example: '/həˈloʊ/', required: false })
  usPhonetic?: string;

  @Column({ name: 'uk_phonetic', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '英式音标', example: '/həˈləʊ/', required: false })
  ukPhonetic?: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: '中文释义', example: '你好；问候' })
  meaning: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '例句', example: 'Hello, how are you?' })
  example?: string;

  @Column({ name: 'audio_url', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '发音音频链接', example: 'https://example.com/audio/hello.mp3', required: false })
  audioUrl?: string;

  @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '图片链接', example: 'https://example.com/images/hello.jpg', required: false })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  @ApiProperty({ description: '删除时间', example: '2024-01-01T00:00:00Z', required: false })
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
