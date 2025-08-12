import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '用户ID' })
  id: number;

  @Column({ length: 100, unique: true })
  @ApiProperty({ description: '用户名' })
  name: string;

  @Column({ length: 255, unique: true })
  @ApiProperty({ description: '邮箱' })
  email: string;

  @Column({ length: 255 })
  @ApiProperty({ description: '密码' })
  password: string;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活', default: true })
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
