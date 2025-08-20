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
    const response = await fetch('https://api.github.com/repos/Xi-Yuer/Typing');
    const data = await response.json();
    return String(formatNumber(data.stargazers_count)).toUpperCase();
  } catch (error) {
    console.error('Error fetching stargazers count:', error);
    return null;
  }
};

// 判断是否为单词（非标点符号）
export const isWord = (text: string): boolean => {
  // 支持英文、中文、日文、韩文、俄文等多种语言
  return /^[\p{L}\p{M}']+$/u.test(text);
};

// 获取单词宽度
export const getWordWidth = (word: string): number => {
  return Math.max(word.length, 4);
};

// 获取单词样式类名
export const getWordsClassNames = (word: WordState): string => {
  // 错误状态优先显示，确保错误时始终显示红色
  if (word.incorrect) {
    return 'text-red-500 border-b-red-500 animate-pulse';
  }

  // 当前激活的单词显示紫色，移除focusing条件确保始终显示
  if (word.isActive) {
    return 'text-fuchsia-500 border-b-fuchsia-500';
  }

  // 已完成的单词显示灰色
  if (word.completed) {
    return 'text-gray-300 border-b-gray-300';
  }

  // 默认状态
  return 'text-gray-400 border-b-gray-300';
};
