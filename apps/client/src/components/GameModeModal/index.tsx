'use client';
import React from 'react';
import { Modal } from 'antd';
import { GameMode, GameModeConfig } from './types';

interface GameModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

/**
 * 游戏模式选择弹窗组件
 */
const GameModeModal: React.FC<GameModeModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onModeChange
}) => {
  /**
   * 处理模式选择
   */
  const handleModeSelect = (mode: {
    key: GameMode;
    title: string;
    description: string;
    disabled?: boolean;
  }) => {
    if (mode.disabled) return;
    onModeChange(mode.key);
    onClose();
  };

  /**
   * 游戏模式配置
   */
  const gameModes: Array<{
    key: GameMode;
    title: string;
    description: string;
    disabled?: boolean;
  }> = [
    {
      key: 'translation',
      title: '中译英模式',
      description: '看到中文提示，尝试用英文表达，练习运用所学词汇和语法。'
    },
    {
      key: 'listening',
      title: '听写模式',
      description: '听音频，写出你听到的英文单词，训练听力，掌握单词拼写。'
    },
    {
      key: 'dictation',
      title: '听力模式',
      description: '播放英语音频，让你沉浸在语言环境中，培养语感，熟悉发音。'
    },
    {
      key: 'speaking',
      title: '口语模式',
      // 开发中...
      disabled: true,
      description: '看到中文提示，尝试用口语表达，提高口语流利度。'
    }
  ];

  return (
    <Modal
      title={
        <span className='text-white text-lg font-medium'>选择游戏模式</span>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={520}
      className='game-mode-modal'
      mask={false}
      maskClosable={false}
      styles={{
        content: {
          backgroundColor: 'rgba(30, 30, 30, 1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(20px)'
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 20px'
        },
        body: {
          padding: '20px'
        }
      }}>
      <div className='space-y-3'>
        {gameModes.map(mode => (
          <div
            key={mode.key}
            onClick={() => handleModeSelect(mode)}
            className={`
              relative p-4 rounded-lg border cursor-pointer transition-all duration-300 backdrop-blur-sm
              ${
                currentMode === mode.key
                  ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:border-purple-400/30 hover:bg-white/10'
              }
              ${mode.disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}>
            {/* 选中状态指示器 */}
            {currentMode === mode.key && (
              <div className='absolute top-3 right-3 w-3 h-3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50'></div>
            )}

            {/* 模式标题 */}
            <h3
              className={`text-base font-medium mb-2 transition-colors duration-300 ${
                currentMode === mode.key ? 'text-purple-300' : 'text-white'
              }`}>
              {mode.title}
              {mode.disabled && (
                <span className='ml-2 text-xs text-red-500'>开发中</span>
              )}
            </h3>

            {/* 模式描述 */}
            <p
              className={`text-sm leading-relaxed transition-colors duration-300 ${
                currentMode === mode.key
                  ? 'text-purple-200/80'
                  : 'text-gray-400'
              }`}>
              {mode.description}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default GameModeModal;
