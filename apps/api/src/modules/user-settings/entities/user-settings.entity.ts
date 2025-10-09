import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export interface ShortcutConfig {
  key: string;
  modifiers: string[];
}

export interface UserSettingsData {
  voiceType: '0' | '1';
  pronunciationVolume: number;
  typingSoundVolume: number;
  soundEnabled: boolean;
  autoPlayPronunciation: boolean;
  showShortcutHints: boolean;
  ignoreCase: boolean;
  shortcuts: {
    resetExercise: ShortcutConfig;
    toggleHint: ShortcutConfig;
    pronunciation: ShortcutConfig;
    wordNavigation: {
      prev: ShortcutConfig;
      next: ShortcutConfig;
    };
  };
}

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '设置ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '用户ID' })
  userId: number;

  @Column('json')
  @ApiProperty({
    description: '用户设置数据',
    type: 'object',
    additionalProperties: true, // 修复：当 type 为 'object' 时，需要指定 additionalProperties
    example: {
      voiceType: '1',
      pronunciationVolume: 100,
      typingSoundVolume: 100,
      soundEnabled: true,
      autoPlayPronunciation: true,
      showShortcutHints: true,
      ignoreCase: false,
      shortcuts: {
        resetExercise: { key: 'r', modifiers: ['ctrl'] },
        toggleHint: { key: 'h', modifiers: ['ctrl'] },
        pronunciation: { key: 'p', modifiers: ['ctrl'] },
        wordNavigation: {
          prev: { key: 'arrowleft', modifiers: ['ctrl'] },
          next: { key: 'arrowright', modifiers: ['ctrl'] }
        }
      }
    }
  })
  settings: UserSettingsData;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
