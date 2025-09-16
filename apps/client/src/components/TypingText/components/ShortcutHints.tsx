import React, { useState, useEffect } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { getModifierKey, UI_TEXT } from '../constants';
import { ShortcutConfig } from '../types';

interface ShortcutHintsProps {
  focusInput?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onResetExercise?: () => void;
  playWordPronunciation?: () => void;
  onToggleHint?: () => void;
  submitAnswer?: () => void;
}

export const ShortcutHints: React.FC<ShortcutHintsProps> = ({
  focusInput,
  onPrev,
  onNext,
  onResetExercise,
  playWordPronunciation,
  onToggleHint,
  submitAnswer
}) => {
  const [shortcuts, setShortcuts] = useState<ShortcutConfig[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 在客户端动态生成快捷键配置
    const dynamicShortcuts: ShortcutConfig[] = [
      {
        keys: [getModifierKey(), 'R'],
        label: '重置练习',
        onClick: onResetExercise
      },
      {
        keys: [getModifierKey(), 'P'],
        label: '发音',
        onClick: playWordPronunciation
      },
      { keys: [getModifierKey(), 'H'], label: '提示', onClick: onToggleHint },
      { keys: ['Space  | Enter'], label: '提交', onClick: submitAnswer }
    ];
    setShortcuts(dynamicShortcuts);
    setIsMounted(true);
  }, [
    onResetExercise,
    playWordPronunciation,
    onToggleHint,
    submitAnswer,
    focusInput
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
        }}
      >
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

  return (
    <div className='mt-16 w-screen flex items-center justify-between relative z-50 select-none px-8'>
      <div className='flex items-center  pl-20 cursor-pointer' onClick={onPrev}>
        <Tooltip title={UI_TEXT.TOOLTIPS.PREV} color='purple'>
          <LeftOutlined className='text-3xl' />
        </Tooltip>
      </div>

      <div className='flex flex-1 items-center justify-center space-x-6 text-sm'>
        {isMounted && shortcuts.map(renderShortcut)}
      </div>

      <div className='flex items-center  pr-20 cursor-pointer' onClick={onNext}>
        <Tooltip title={UI_TEXT.TOOLTIPS.NEXT} color='purple'>
          <RightOutlined className='text-3xl' />
        </Tooltip>
      </div>
    </div>
  );
};
