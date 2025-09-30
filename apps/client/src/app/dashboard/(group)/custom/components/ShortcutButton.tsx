'use client';
import React from 'react';
import { Button } from 'antd';

// 修饰键显示映射
const MODIFIER_DISPLAY = {
  ctrl: 'Ctrl',
  meta: '⌘', // Mac 上 Meta 键显示为 ⌘
  alt: 'Alt',
  shift: 'Shift',
  option: '⌥'
} as const;

interface ShortcutButtonProps {
  keyName: string;
  currentShortcut: { key: string; modifiers: string[] };
  listeningKey: string | null;
  pressedModifiers: string[];
  onToggleListening: (keyName?: string) => void;
  checkShortcutConflict: (
    shortcut: { key: string; modifiers: string[] },
    excludeKeyName?: string
  ) => { hasConflict: boolean; conflictWith?: string };
}

export default function ShortcutButton({
  keyName,
  currentShortcut,
  listeningKey,
  pressedModifiers,
  onToggleListening,
  checkShortcutConflict
}: ShortcutButtonProps) {
  const isListening = listeningKey === keyName;

  // 检查当前快捷键是否与其他快捷键冲突
  const hasConflict =
    currentShortcut.key &&
    checkShortcutConflict(currentShortcut, keyName).hasConflict;

  // 格式化快捷键显示
  const formatShortcut = (shortcut: { key: string; modifiers: string[] }) => {
    const modifierText =
      shortcut.modifiers.length > 0
        ? shortcut.modifiers
            .map(m => MODIFIER_DISPLAY[m as keyof typeof MODIFIER_DISPLAY] || m)
            .join(' + ') + ' + '
        : '';

    const keyText =
      shortcut.key === 'space'
        ? 'Space'
        : shortcut.key.startsWith('arrow')
          ? shortcut.key.replace('arrow', '')
          : shortcut.key.startsWith('f')
            ? shortcut.key.toUpperCase()
            : shortcut.key.toUpperCase();

    return `${modifierText}${keyText}`;
  };

  return (
    <div className='flex flex-col space-y-3'>
      <Button
        type={isListening ? 'primary' : 'dashed'}
        onClick={() => onToggleListening(keyName)}
        className={`min-w-[180px] h-12 text-base font-medium transition-all duration-300 ${
          isListening
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
            : hasConflict
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40'
              : 'bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white hover:text-gray-100 shadow-md hover:shadow-lg'
        }`}>
        {isListening
          ? `按住修饰键${pressedModifiers.length > 0 ? pressedModifiers.join(' + ') + ' + ' : ''}`
          : formatShortcut(currentShortcut)}
      </Button>
      {hasConflict && (
        <div className='text-red-400 text-sm text-center'>⚠️ 快捷键冲突</div>
      )}
    </div>
  );
}
