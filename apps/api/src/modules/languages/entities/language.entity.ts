import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '语言 ID' })
  id: number;

  @Column({ length: 50 })
  @ApiProperty({ description: '语言名称（English, 日本語, Français）' })
  name: string;

  @Column({ length: 10, unique: true })
  @ApiProperty({ description: '语言代码（en, ja, fr）' })
  code: string;

  @Column({ length: 50 })
  @ApiProperty({ description: '文字体系（Latin, Kanji, Cyrillic）' })
  script: string;

  @Column({ name: 'is_active', default: true })
  @ApiProperty({ description: '是否启用', default: true })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '删除时间', required: false })
  deleteTime?: Date;
}
