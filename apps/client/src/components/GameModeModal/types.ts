/**
 * 游戏模式类型定义
 */
export type GameMode = 'translation' | 'listening' | 'dictation' | 'speaking';

/**
 * 游戏模式配置接口
 */
export interface GameModeConfig {
  key: GameMode;
  title: string;
  description: string;
  icon: string;
  color: string;
  available: boolean;
  disabled?: boolean;
}

/**
 * 游戏模式弹窗属性接口
 */
export interface GameModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: GameModeConfig;
  onModeChange: (mode: GameModeConfig) => void;
}

/**
 * 游戏模式状态接口
 */
export interface GameModeState {
  currentMode: GameModeConfig;
  isModalOpen: boolean;
}