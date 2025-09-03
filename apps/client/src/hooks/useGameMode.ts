'use client';
import { useState, useCallback } from 'react';
import { GameMode } from '@/components/GameModeModal/types';

/**
 * 游戏模式管理Hook
 * 提供游戏模式状态管理和切换功能
 */
export const useGameMode = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>('translation');
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 切换游戏模式
   */
  const changeMode = useCallback((mode: GameMode) => {
    setCurrentMode(mode);
  }, []);

  /**
   * 打开模式选择弹窗
   */
  const openModeModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * 关闭模式选择弹窗
   */
  const closeModeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  /**
   * 获取当前模式的显示名称
   */
  const getCurrentModeTitle = useCallback(() => {
    const modeMap: Record<GameMode, string> = {
      dictation: '听写模式',
      translation: '翻译模式',
      audioWriting: '音频默写模式',
      silentTranslation: '静默拼写模式',
      speaking: '口语模式'
    };
    return modeMap[currentMode];
  }, [currentMode]);

  return {
    currentMode,
    isModalOpen,
    changeMode,
    openModeModal,
    closeModeModal,
    getCurrentModeTitle
  };
};
