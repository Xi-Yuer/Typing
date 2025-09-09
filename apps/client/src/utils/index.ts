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
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/30',
        label: '简单'
      };
    case '2':
      return {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        label: '普通'
      };
    case '3':
    case 'medium':
    case '中等':
      return {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        label: '中等'
      };
    case '4':
      return {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        label: '困难'
      };
    case '5':
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/30',
        label: '极难'
      };
    default:
      return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        border: 'border-gray-500/30',
        label: String(difficulty) || '未知'
      };
  }
};
