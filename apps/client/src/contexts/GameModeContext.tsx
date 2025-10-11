'use client';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from 'react';
import { GameMode } from '@/components/GameModeModal/types';

interface GameModeContextType {
  currentMode: GameMode;
  isModalOpen: boolean;
  isInitialized: boolean;
  changeMode: (mode: GameMode) => void;
  openModeModal: () => void;
  closeModeModal: () => void;
  getCurrentModeTitle: () => string;
}

const GameModeContext = createContext<GameModeContextType | undefined>(
  undefined
);

interface GameModeProviderProps {
  children: ReactNode;
}

/**
 * 游戏模式Context Provider
 * 提供全局的游戏模式状态管理
 */
export const GameModeProvider: React.FC<GameModeProviderProps> = ({
  children
}) => {
  const [currentMode, setCurrentMode] = useState<GameMode>('dictation');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * 切换游戏模式
   */
  const changeMode = useCallback((mode: GameMode) => {
    setCurrentMode(mode);
    // 可以在这里添加持久化逻辑，比如保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('gameMode', mode);
    }
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

  // 初始化时从localStorage读取保存的模式
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('gameMode') as GameMode;
      if (
        savedMode &&
        ['translation', 'listening', 'dictation', 'speaking'].includes(
          savedMode
        )
      ) {
        setCurrentMode(savedMode);
      }
      setIsInitialized(true);
    }
  }, []);

  const value: GameModeContextType = {
    currentMode,
    isModalOpen,
    isInitialized,
    changeMode,
    openModeModal,
    closeModeModal,
    getCurrentModeTitle
  };

  return (
    <GameModeContext.Provider value={value}>
      {children}
    </GameModeContext.Provider>
  );
};

/**
 * 使用游戏模式Context的Hook
 */
export const useGameModeContext = (): GameModeContextType => {
  const context = useContext(GameModeContext);
  if (context === undefined) {
    throw new Error(
      'useGameModeContext must be used within a GameModeProvider'
    );
  }
  return context;
};
