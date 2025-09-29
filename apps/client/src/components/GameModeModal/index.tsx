'use client';
import React from 'react';
import { Modal } from 'antd';
import { GameMode } from './types';

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
      key: 'dictation',
      title: '听写模式',
      description: '看到母语提示并听到外语音频，用户需要输入对应的外语内容。'
    },
    {
      key: 'translation',
      title: '翻译模式',
      description: '看到外语内容并听到外语音频，用户需要输入对应的母语翻译。'
    },
    {
      key: 'audioWriting',
      title: '音频默写模式',
      description: '只听外语音频，不显示翻译，用户需要写出对应的外语内容。'
    },
    {
      key: 'silentTranslation',
      title: '静默拼写模式',
      description:
        '只看到母语提示，不提供音频和翻译，用户需要输入对应的外语内容。'
    },
    {
      key: 'speaking',
      title: '口语模式',
      disabled: true,
      description:
        '看到母语提示并听到外语音频，用户需要用口语说出对应的外语内容。'
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
      styles={{
        content: {
          background:
            'linear-gradient(135deg, rgba(15, 20, 35, 0.95) 0%, rgba(25, 30, 50, 0.9) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(20px)'
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '16px 20px',
          color: 'white'
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
              ${mode.disabled ? '!cursor-not-allowed opacity-50' : ''}
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
