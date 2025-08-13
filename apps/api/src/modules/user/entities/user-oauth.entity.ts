import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export enum OAuthProvider {
  GITHUB = 'github',
  GOOGLE = 'google',
  WECHAT = 'wechat',
  QQ = 'qq',
}

@Entity('user_oauth')
@Index(['provider', 'providerId'], { unique: true })
export class UserOAuth {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'OAuth记录ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '关联的用户ID' })
  userId: number;

  @Column({
    type: 'enum',
    enum: OAuthProvider,
  })
  @ApiProperty({ description: '第三方平台', enum: OAuthProvider })
  provider: OAuthProvider;

  @Column({ length: 100 })
  @ApiProperty({ description: '第三方平台用户ID' })
  providerId: string;

  @Column({ length: 100, nullable: true })
  @ApiProperty({ description: '第三方平台用户名', required: false })
  providerUsername?: string;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: '第三方平台邮箱', required: false })
  providerEmail?: string;

  @Column({ length: 500, nullable: true })
  @ApiProperty({ description: '第三方平台头像URL', required: false })
  avatarUrl?: string;

  @Column('json', { nullable: true })
  @ApiProperty({ description: '第三方平台原始数据', required: false })
  rawData?: any;

  @Column({ length: 500, nullable: true })
  @ApiProperty({ description: 'Access Token', required: false })
  accessToken?: string;

  @Column({ length: 500, nullable: true })
  @ApiProperty({ description: 'Refresh Token', required: false })
  refreshToken?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Token过期时间', required: false })
  tokenExpiresAt?: Date;

  @CreateDateColumn()
  @ApiProperty({ description: '绑定时间' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '删除时间', required: false })
  deleteTime?: Date;

  // 关联用户
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}