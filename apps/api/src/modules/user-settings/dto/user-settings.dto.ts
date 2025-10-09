import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';

export class ShortcutConfigDto {
  @ApiProperty({ description: '快捷键主键', example: 'r' })
  @IsString()
  key: string;

  @ApiProperty({
    description: '修饰键数组',
    example: ['ctrl'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  modifiers: string[];
}

export class WordNavigationDto {
  @ApiProperty({ description: '上一个单词快捷键' })
  @ValidateNested()
  @Type(() => ShortcutConfigDto)
  prev: ShortcutConfigDto;

  @ApiProperty({ description: '下一个单词快捷键' })
  @ValidateNested()
  @Type(() => ShortcutConfigDto)
  next: ShortcutConfigDto;
}

export class ShortcutsDto {
  @ApiProperty({ description: '重置练习快捷键' })
  @ValidateNested()
  @Type(() => ShortcutConfigDto)
  resetExercise: ShortcutConfigDto;

  @ApiProperty({ description: '切换提示快捷键' })
  @ValidateNested()
  @Type(() => ShortcutConfigDto)
  toggleHint: ShortcutConfigDto;

  @ApiProperty({ description: '播放发音快捷键' })
  @ValidateNested()
  @Type(() => ShortcutConfigDto)
  pronunciation: ShortcutConfigDto;

  @ApiProperty({ description: '单词导航快捷键' })
  @ValidateNested()
  @Type(() => WordNavigationDto)
  wordNavigation: WordNavigationDto;
}

export class UpdateUserSettingsDto {
  @ApiProperty({
    description: '发音音色',
    example: '1',
    enum: ['0', '1']
  })
  @IsOptional()
  @IsString()
  voiceType?: '0' | '1';

  @ApiProperty({
    description: '发音音量',
    example: 100,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  pronunciationVolume?: number;

  @ApiProperty({
    description: '键盘音效音量',
    example: 100,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  typingSoundVolume?: number;

  @ApiProperty({
    description: '是否启用音效',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  soundEnabled?: boolean;

  @ApiProperty({
    description: '是否自动播放发音',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  autoPlayPronunciation?: boolean;

  @ApiProperty({
    description: '是否显示快捷键提示',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  showShortcutHints?: boolean;

  @ApiProperty({ description: '快捷键配置' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShortcutsDto)
  shortcuts?: ShortcutsDto;

  @ApiProperty({ description: '是否忽略大小写', example: false })
  @IsOptional()
  @IsBoolean()
  ignoreCase?: boolean;
}

export class UserSettingsResponseDto {
  @ApiProperty({ description: '设置ID' })
  id: number;

  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ApiProperty({
    description: '用户设置数据',
    additionalProperties: true,
    type: 'object'
  })
  settings: {
    voiceType: '0' | '1';
    pronunciationVolume: number;
    typingSoundVolume: number;
    soundEnabled: boolean;
    autoPlayPronunciation: boolean;
    showShortcutHints: boolean;
    ignoreCase: boolean;
    shortcuts: {
      resetExercise: ShortcutConfigDto;
      toggleHint: ShortcutConfigDto;
      pronunciation: ShortcutConfigDto;
      wordNavigation: {
        prev: ShortcutConfigDto;
        next: ShortcutConfigDto;
      };
    };
  };

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  updateTime: Date;
}
