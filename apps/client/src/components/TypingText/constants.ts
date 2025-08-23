// 检测是否为Mac系统
export const IS_MAC =
  typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);

// 根据系统返回对应的修饰键
export const getModifierKey = () => (IS_MAC ? '⌘' : 'Ctrl');

// 快捷键配置
export const KEYBOARD_SHORTCUTS = {
  RESET_EXERCISE: 'r',
  TOGGLE_HINT: 'h',
  PRONUNCIATION: 'p',
  SUBMIT_KEYS: { SPACE: ' ', ENTER: 'Enter' },
  NAVIGATION_KEYS: {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
    ESCAPE: 'Escape',
    BACKSPACE: 'Backspace'
  },
  WORD_NAVIGATION: {
    PREV: 'ArrowLeft',
    NEXT: 'ArrowRight'
  }
} as const;

// UI文本配置
export const UI_TEXT = {
  TOOLTIPS: {
    PREV: `${getModifierKey()} + ←`,
    NEXT: `${getModifierKey()} + →`
  }
} as const;

// 样式配置
export const STYLES = {
  WORD_HEIGHT: 'h-16',
  WORD_TEXT_SIZE: 'text-5xl',
  HINT_TIMEOUT: 1500,
  COLORS: {
    ERROR: 'text-red-500',
    NORMAL: 'text-purple-500',
    HINT: 'text-gray-400 opacity-50'
  }
} as const;

// 音频配置
export const AUDIO_CONFIG = {
  DEFAULT_ACCENT: 'us' as const,
  SUPPORTED_ACCENTS: ['us', 'uk'] as const
} as const;
