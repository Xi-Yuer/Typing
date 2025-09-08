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
import { User } from '../../user/entities/user.entity';
import { Word } from '../../words/entities/word.entity';

@Entity('word_error_reports')
export class WordErrorReport {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @ApiProperty({ description: '错误报告 ID', example: '1' })
  id: string;

  @Column({ name: 'user_id', type: 'bigint' })
  @ApiProperty({ description: '报告用户 ID', example: '1' })
  userId: string;

  @Column({ name: 'word_id', type: 'bigint' })
  @ApiProperty({ description: '被报告的单词 ID', example: '1' })
  wordId: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: '错误描述', example: '这个单词的发音标注有误' })
  errorDescription: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  @ApiProperty({
    description: '处理状态',
    example: 'pending',
    enum: ['pending', 'reviewing', 'accepted', 'rejected']
  })
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: '管理员处理备注',
    example: '已确认错误，已修正',
    required: false
  })
  adminNote?: string;

  @Column({ name: 'processed_by', type: 'bigint', nullable: true })
  @ApiProperty({
    description: '处理管理员 ID',
    example: '2',
    required: false
  })
  processedBy?: string;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  @ApiProperty({
    description: '处理时间',
    example: '2024-01-01T00:00:00Z',
    required: false
  })
  processedAt?: Date;

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
  @ApiProperty({ description: '报告用户信息', type: () => User })
  user: User;

  @ManyToOne(() => Word, { eager: false })
  @JoinColumn({ name: 'word_id' })
  @ApiProperty({ description: '被报告的单词信息', type: () => Word })
  word: Word;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'processed_by' })
  @ApiProperty({
    description: '处理管理员信息',
    type: () => User,
    required: false
  })
  processor?: User;
}
