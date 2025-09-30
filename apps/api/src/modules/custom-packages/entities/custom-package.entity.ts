import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { CustomWord } from './custom-word.entity';

@Entity('custom_packages')
export class CustomPackage {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @ApiProperty({ description: '自定义学习包 ID', example: '1' })
  id: string;

  @Column({ name: 'user_id', type: 'bigint' })
  @ApiProperty({ description: '创建用户 ID', example: '1' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '学习包名称', example: '我的英语单词包' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: '学习包描述',
    example: '包含常用英语单词的学习包'
  })
  description?: string;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '单词数量', example: 100 })
  wordCount: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: '是否公开', example: true })
  isPublic: boolean;

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
  @ApiProperty({ description: '创建用户', type: () => User })
  user: User;

  @OneToMany(() => CustomWord, customWord => customWord.customPackage)
  @ApiProperty({ description: '包含的单词', type: () => [CustomWord] })
  words: CustomWord[];
}
