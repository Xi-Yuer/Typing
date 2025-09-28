import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserSettings,
  UserSettingsData
} from './entities/user-settings.entity';
import { UpdateUserSettingsDto } from './dto/user-settings.dto';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly userSettingsRepository: Repository<UserSettings>
  ) {}

  // 默认设置
  private defaultSettings: (userAgent?: string) => UserSettingsData = (
    userAgent?: string
  ) => ({
    voiceType: '1',
    pronunciationVolume: 100,
    typingSoundVolume: 100,
    soundEnabled: true,
    autoPlayPronunciation: true,
    showShortcutHints: true,
    shortcuts: {
      resetExercise: {
        key: 'r',
        modifiers: userAgent?.includes('Mac') ? ['meta'] : ['ctrl']
      },
      toggleHint: {
        key: 'h',
        modifiers: userAgent?.includes('Mac') ? ['meta'] : ['ctrl']
      },
      pronunciation: {
        key: 'p',
        modifiers: userAgent?.includes('Mac') ? ['meta'] : ['ctrl']
      },
      wordNavigation: {
        prev: {
          key: 'arrowleft',
          modifiers: userAgent?.includes('Mac') ? ['meta'] : ['ctrl']
        },
        next: {
          key: 'arrowright',
          modifiers: userAgent?.includes('Mac') ? ['meta'] : ['ctrl']
        }
      }
    }
  });

  /**
   * 获取用户设置，如果不存在则创建默认设置
   */
  async getUserSettings(
    userId?: number,
    userAgent?: string
  ): Promise<UserSettings> {
    if (!userId) {
      return Promise.resolve({
        id: 0,
        userId: 0,
        settings: this.defaultSettings(userAgent),
        createTime: new Date(),
        updateTime: new Date(),
        user: null as any
      });
    }
    let userSettings = await this.userSettingsRepository.findOne({
      where: { userId }
    });

    if (!userSettings) {
      // 创建默认设置
      userSettings = this.userSettingsRepository.create({
        userId,
        settings: this.defaultSettings(userAgent)
      });
      userSettings = await this.userSettingsRepository.save(userSettings);
    }

    return userSettings;
  }

  /**
   * 更新用户设置
   */
  async updateUserSettings(
    userId: number,
    updateDto: UpdateUserSettingsDto,
    userAgent?: string
  ): Promise<UserSettings> {
    let userSettings = await this.userSettingsRepository.findOne({
      where: { userId }
    });

    if (!userSettings) {
      // 如果不存在，创建新的设置记录
      userSettings = this.userSettingsRepository.create({
        userId,
        settings: { ...this.defaultSettings(userAgent), ...updateDto }
      });
    } else {
      // 合并现有设置
      userSettings.settings = {
        ...userSettings.settings,
        ...updateDto,
        // 如果更新了快捷键，需要深度合并
        shortcuts: updateDto.shortcuts
          ? { ...userSettings.settings.shortcuts, ...updateDto.shortcuts }
          : userSettings.settings.shortcuts
      };
    }

    return await this.userSettingsRepository.save(userSettings);
  }

  /**
   * 重置用户设置为默认值
   */
  async resetUserSettings(
    userId: number,
    userAgent?: string
  ): Promise<UserSettings> {
    let userSettings = await this.userSettingsRepository.findOne({
      where: { userId }
    });

    if (!userSettings) {
      // 创建默认设置
      userSettings = this.userSettingsRepository.create({
        userId,
        settings: this.defaultSettings(userAgent)
      });
    } else {
      // 重置为默认设置
      userSettings.settings = this.defaultSettings(userAgent);
    }

    return await this.userSettingsRepository.save(userSettings);
  }

  /**
   * 删除用户设置
   */
  async deleteUserSettings(userId: number): Promise<void> {
    const result = await this.userSettingsRepository.delete({ userId });
    if (result.affected === 0) {
      throw new NotFoundException('用户设置不存在');
    }
  }

  /**
   * 获取默认设置
   */
  getDefaultSettings(userAgent?: string): UserSettingsData {
    return this.defaultSettings(userAgent);
  }
}
