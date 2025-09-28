import React, { useState, useEffect } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { getModifierKey, UI_TEXT } from '../constants';
import { ShortcutConfig } from '../types';
import { UserSettings } from '@/types';

interface ShortcutHintsProps {
  focusInput?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onResetExercise?: () => void;
  playWordPronunciation?: () => void;
  onToggleHint?: () => void;
  submitAnswer?: () => void;
  userSettings?: UserSettings;
}

export const ShortcutHints: React.FC<ShortcutHintsProps> = ({
  focusInput,
  onPrev,
  onNext,
  onResetExercise,
  playWordPronunciation,
  onToggleHint,
  submitAnswer,
  userSettings
}) => {
  const [shortcuts, setShortcuts] = useState<ShortcutConfig[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 格式化快捷键显示
  const formatShortcutDisplay = (shortcut: {
    key: string;
    modifiers: string[];
  }): string[] => {
    if (!shortcut.key) return [];

    const modifierDisplay = shortcut.modifiers.map(mod => {
      switch (mod) {
        case 'ctrl':
          return getModifierKey();
        case 'meta':
          return '⌘';
        case 'alt':
          return 'Alt';
        case 'shift':
          return 'Shift';
        case 'option':
          return '⌥';
        default:
          return mod;
      }
    });

    const keyDisplay =
      shortcut.key === 'space' ? 'Space' : shortcut.key.toUpperCase();
    return [...modifierDisplay, keyDisplay];
  };

  useEffect(() => {
    // 根据用户设置动态生成快捷键配置
    const dynamicShortcuts: ShortcutConfig[] = [
      {
        keys: userSettings?.shortcuts?.resetExercise
          ? formatShortcutDisplay(userSettings.shortcuts.resetExercise)
          : [getModifierKey(), 'R'],
        label: '重置练习',
        onClick: onResetExercise
      },
      {
        keys: userSettings?.shortcuts?.pronunciation
          ? formatShortcutDisplay(userSettings.shortcuts.pronunciation)
          : [getModifierKey(), 'P'],
        label: '发音',
        onClick: playWordPronunciation
      },
      {
        keys: userSettings?.shortcuts?.toggleHint
          ? formatShortcutDisplay(userSettings.shortcuts.toggleHint)
          : [getModifierKey(), 'H'],
        label: '提示',
        onClick: onToggleHint
      },
      { keys: ['Space  | Enter'], label: '提交', onClick: submitAnswer }
    ];
    setShortcuts(dynamicShortcuts);
    setIsMounted(true);
  }, [
    onResetExercise,
    playWordPronunciation,
    onToggleHint,
    submitAnswer,
    focusInput,
    userSettings
  ]);

  const renderShortcut = (shortcut: ShortcutConfig, index: number) => {
    const keys = shortcut.keys;

    return (
      <div
        key={index}
        className='flex items-center space-x-1 cursor-pointer hover:bg-fuchsia-500/20 rounded-md py-4 px-2 transition-all duration-300'
        onClick={() => {
          shortcut.onClick?.();
          focusInput?.();
        }}>
        {keys.map((key, keyIndex) => (
          <div key={keyIndex}>
            {keyIndex > 0 && (
              <span className='text-xs text-fuchsia-300'>+</span>
            )}
            <kbd className='px-2 py-1 bg-fuchsia-500/20 border border-fuchsia-400/30 rounded text-xs font-mono text-fuchsia-300'>
              {key}
            </kbd>
          </div>
        ))}
        <span className='ml-1 font-bold text-white'>{shortcut.label}</span>
      </div>
    );
  };

  // 生成导航快捷键提示
  const getNavigationTooltip = (type: 'prev' | 'next') => {
    if (!userSettings?.shortcuts?.wordNavigation) {
      return type === 'prev' ? UI_TEXT.TOOLTIPS.PREV : UI_TEXT.TOOLTIPS.NEXT;
    }

    const shortcut =
      type === 'prev'
        ? userSettings.shortcuts.wordNavigation.prev
        : userSettings.shortcuts.wordNavigation.next;

    if (!shortcut.key) {
      return type === 'prev' ? UI_TEXT.TOOLTIPS.PREV : UI_TEXT.TOOLTIPS.NEXT;
    }

    const keys = formatShortcutDisplay(shortcut);
    return keys.join(' + ');
  };

  return (
    userSettings?.showShortcutHints && (
      <div className='mt-16 w-screen flex items-center justify-between relative z-50 select-none px-8'>
        <div
          className='flex items-center  pl-20 cursor-pointer'
          onClick={onPrev}>
          <Tooltip title={getNavigationTooltip('prev')} color='purple'>
            <LeftOutlined className='text-3xl' />
          </Tooltip>
        </div>

        <div className='flex flex-1 items-center justify-center space-x-6 text-sm'>
          {isMounted && shortcuts.map(renderShortcut)}
        </div>

        <div
          className='flex items-center  pr-20 cursor-pointer'
          onClick={onNext}>
          <Tooltip title={getNavigationTooltip('next')} color='purple'>
            <RightOutlined className='text-3xl' />
          </Tooltip>
        </div>
      </div>
    )
  );
};
