import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Word } from '../../words/entities/word.entity';
import { CorpusCategory } from '../../corpus-categories/entities/corpus-category.entity';

@Entity('word_error_records')
@Unique(['userId', 'wordId']) // 确保每个用户对每个单词只有一条记录
export class WordErrorRecord {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @ApiProperty({ description: '错词记录 ID', example: '1' })
  id: string;

  @Column({ name: 'user_id', type: 'bigint' })
  @ApiProperty({ description: '用户 ID', example: '1' })
  userId: string;

  @Column({ name: 'word_id', type: 'bigint' })
  @ApiProperty({ description: '单词 ID', example: '1' })
  wordId: string;

  @Column({ name: 'category_id', type: 'bigint' })
  @ApiProperty({ description: '分类 ID', example: '1' })
  categoryId: string;

  @Column({ name: 'language_id', type: 'bigint' })
  @ApiProperty({ description: '语言 ID', example: '1' })
  languageId: string;

  @Column({ name: 'error_count', type: 'int', default: 1 })
  @ApiProperty({ description: '错误次数', example: 3 })
  errorCount: number;

  @Column({ name: 'last_error_time', type: 'timestamp' })
  @ApiProperty({ description: '最后错误时间', example: '2024-01-01T00:00:00Z' })
  lastErrorTime: Date;

  @Column({ name: 'first_error_time', type: 'timestamp' })
  @ApiProperty({ description: '首次错误时间', example: '2024-01-01T00:00:00Z' })
  firstErrorTime: Date;

  @Column({ name: 'is_practiced', type: 'boolean', default: false })
  @ApiProperty({ description: '是否已练习过', example: false })
  isPracticed: boolean;

  @Column({ name: 'practice_count', type: 'int', default: 0 })
  @ApiProperty({ description: '练习次数', example: 2 })
  practiceCount: number;

  @Column({ name: 'last_practice_time', type: 'timestamp', nullable: true })
  @ApiProperty({
    description: '最后练习时间',
    example: '2024-01-01T00:00:00Z',
    required: false
  })
  lastPracticeTime?: Date;

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
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户信息', type: () => User })
  user: User;

  @ManyToOne(() => Word, { eager: true })
  @JoinColumn({ name: 'word_id' })
  @ApiProperty({ description: '单词信息', type: () => Word })
  word: Word;

  @ManyToOne(() => CorpusCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  @ApiProperty({ description: '分类信息', type: () => CorpusCategory })
  category: CorpusCategory;
}
