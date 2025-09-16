import { Word } from '@/request/globals';
import { GameMode } from '../GameModeModal/types';

// 单词状态接口
export interface WordState {
  id: number;
  text: string;
  userInput: string;
  isActive: boolean;
  incorrect: boolean;
  completed: boolean;
}

// 组件Props接口
export interface TypingTextProps {
  word?: Word;
  mode?: GameMode;
  className?: string;
  onComplete?: (isCorrect: boolean) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

// 键盘事件处理器类型
export type KeyboardEventHandler = (
  e: React.KeyboardEvent<HTMLInputElement>
) => void;

// 单词操作类型
export type WordAction =
  | { type: 'INITIALIZE'; payload: { word?: Word } }
  | { type: 'UPDATE_INPUT'; payload: { index: number; input: string } }
  | { type: 'SET_ACTIVE'; payload: { index: number } }
  | { type: 'SET_ERROR'; payload: { index: number; hasError: boolean } }
  | { type: 'SET_COMPLETED'; payload: { index: number; completed: boolean } }
  | { type: 'RESET' };

// 快捷键配置类型
export interface ShortcutConfig {
  keys: readonly string[];
  label: string;
  onClick?: () => void;
}

// 音频播放配置类型
export type AudioAccent = 'us' | 'uk';

// 组件状态类型
export interface TypingState {
  inputValue: string;
  currentWordIndex: number;
  isComposing: boolean;
  showAnswerTip: boolean;
  hasError: boolean;
  isAllCorrect: boolean;
  words: WordState[];
}

// Hook返回类型
export interface UseWordStateReturn {
  words: WordState[];
  currentWordIndex: number;
  initializeWords: (word?: Word) => void;
  updateWordInput: (index: number, input: string) => void;
  setActiveWord: (index: number) => void;
  setWordError: (index: number, hasError: boolean) => void;
  setWordCompleted: (index: number, completed: boolean) => void;
  resetWords: () => void;
  findNextIncompleteWord: (fromIndex: number) => number;
  findPrevIncompleteWord: (fromIndex: number) => number;
}

export interface UseKeyboardHandlersReturn {
  handleKeyDown: KeyboardEventHandler;
  handleGlobalKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleCompositionStart: () => void;
  handleCompositionEnd: () => void;
}

export interface UseTypingLogicReturn {
  words: WordState[];
  inputValue: string;
  isAllCorrect: boolean;
  showAnswerTip: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCompositionStart: () => void;
  handleCompositionEnd: () => void;
  preventCursorMove: (e: React.MouseEvent) => void;
}
