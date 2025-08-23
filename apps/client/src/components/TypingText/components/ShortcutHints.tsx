import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { UI_TEXT, getModifierKey } from '../constants';
import { ShortcutConfig } from '../types';

interface ShortcutHintsProps {
  onPrev?: () => void;
  onNext?: () => void;
}

export const ShortcutHints: React.FC<ShortcutHintsProps> = ({
  onPrev,
  onNext
}) => {
  const renderShortcut = (shortcut: ShortcutConfig, index: number) => {
    // 动态替换快捷键中的修饰键
    const keys = shortcut.keys.map(key =>
      key === 'Ctrl' || key === 'Cmd' ? getModifierKey() : key
    );

    return (
      <div key={index} className='flex items-center space-x-1'>
        {keys.map((key, keyIndex) => (
          <React.Fragment key={keyIndex}>
            {keyIndex > 0 && (
              <span className='text-xs text-fuchsia-300'>+</span>
            )}
            <kbd className='px-2 py-1 bg-fuchsia-500/20 border border-fuchsia-400/30 rounded text-xs font-mono text-fuchsia-300'>
              {key}
            </kbd>
          </React.Fragment>
        ))}
        <span className='ml-1 font-bold'>{shortcut.label}</span>
      </div>
    );
  };

  return (
    <div className='mt-4 flex items-center justify-between bottom-10 absolute w-full select-none px-8'>
      <div
        className='flex items-center text-white/70 pl-20 cursor-pointer'
        onClick={onPrev}
      >
        <Tooltip title={UI_TEXT.TOOLTIPS.PREV} color='purple'>
          <LeftOutlined className='text-3xl' />
        </Tooltip>
      </div>

      <div className='flex items-center justify-center space-x-6 text-sm text-white/70'>
        {UI_TEXT.SHORTCUTS.map(renderShortcut)}
      </div>

      <div
        className='flex items-center text-white/70 pr-20 cursor-pointer'
        onClick={onNext}
      >
        <Tooltip title={UI_TEXT.TOOLTIPS.NEXT} color='purple'>
          <RightOutlined className='text-3xl' />
        </Tooltip>
      </div>
    </div>
  );
};
