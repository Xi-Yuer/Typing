import { WordState } from '@/components/TypingText';

const formatNumber = (num: number) => {
  if (num < 1000) return num.toString();

  const rounded = Math.ceil(num / 100) * 100;
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(rounded);
};

export const getStarsCount = async () => {
  try {
    const count = await fetch('https://api.github.com/repos/Xi-Yuer/Typing')
      .then(res => res.json())
      .then(res => {
        return res.stargazers_count || 0;
      })
      .catch(() => {
        return 0;
      });
    return String(formatNumber(count)).toUpperCase();
  } catch {
    return 0;
  }
};

// 判断是否为单词（非标点符号）
export const isWord = (text: string): boolean => {
  return !/^\p{P}+$/u.test(text);
};

// 获取单词宽度
export const getWordWidth = (word: string): number => {
  return Math.max(word.length + 0.5, 4);
};

// 获取单词样式类名
export const getWordsClassNames = (word: WordState): string => {
  // 错误状态优先显示，确保错误时始终显示红色
  if (word.incorrect) {
    return 'text-red-600 border-b-red-600 animate-pulse';
  }

  // 当前激活的单词显示橙色，移除focusing条件确保始终显示
  if (word.isActive) {
    return 'text-orange-500 border-b-orange-600';
  }

  // 已完成的单词：如果正确完成则保持橙色，否则显示灰色
  if (word.completed) {
    // 检查是否输入正确（用户输入长度等于单词长度且没有错误）
    const isCorrectlyCompleted =
      word.userInput.length === word.text.length && !word.incorrect;
    if (isCorrectlyCompleted) {
      return 'text-orange-500 border-b-orange-600';
    } else {
      return 'text-gray-300 border-b-gray-300';
    }
  }

  // 默认状态
  return 'text-gray-400 border-b-gray-300';
};

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate: boolean = true
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const callNow = immediate && !timeoutId;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) func(...args); // 非立即执行模式
    }, delay);

    if (callNow) func(...args); // 立即执行模式
  };
};

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        func(...args);
      }, delay);
    }
  };
};

/**
 * 根据难度等级获取对应的样式
 * @param difficulty 难度等级
 * @returns 样式对象
 */
export const getDifficultyStyle = (difficulty: string | number) => {
  const difficultyStr = String(difficulty || '').toLowerCase();
  switch (difficultyStr) {
    case '1':
      return {
        bg: 'bg-orange-500/30',
        text: 'text-orange-300',
        border: 'border-orange-400/50',
        label: '简单'
      };
    case '2':
      return {
        bg: 'bg-orange-400/30',
        text: 'text-orange-200',
        border: 'border-orange-300/50',
        label: '普通'
      };
    case '3':
    case 'medium':
    case '中等':
      return {
        bg: 'bg-orange-600/30',
        text: 'text-orange-300',
        border: 'border-orange-500/50',
        label: '中等'
      };
    case '4':
      return {
        bg: 'bg-orange-700/30',
        text: 'text-orange-400',
        border: 'border-orange-600/50',
        label: '困难'
      };
    case '5':
      return {
        bg: 'bg-orange-800/30',
        text: 'text-orange-500',
        border: 'border-orange-700/50',
        label: '极难'
      };
    default:
      return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        border: 'border-gray-500/30',
        label: '未知'
      };
  }
};
