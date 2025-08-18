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

@Entity('corpus_categories')
export class CorpusCategory {
  @ApiProperty({ description: '分类 ID' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ApiProperty({ description: '对应语言 ID' })
  @Column({ name: 'language_id', type: 'bigint' })
  languageId: string;

  @ApiProperty({ description: '分类名称（旅游、商务、日常会话）' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: '分类描述', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: '难度等级（1-5）', minimum: 1, maximum: 5 })
  @Column({ type: 'int' })
  difficulty: number;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn({ name: 'delete_time' })
  deleteTime: Date;

  // 关联关系
  @ApiProperty({ description: '关联的语言', type: () => Language })
  @ManyToOne(() => Language, { eager: true })
  @JoinColumn({ name: 'language_id' })
  language: Language;
}
