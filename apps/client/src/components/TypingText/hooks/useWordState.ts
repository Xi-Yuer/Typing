import { useState, useCallback } from 'react';
import { Word } from '@/request/globals';
import { WordState, UseWordStateReturn } from '../types';
import { isWord } from '@/utils';

export const useWordState = (_initialWord?: Word): UseWordStateReturn => {
  const [words, setWords] = useState<WordState[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // 初始化单词状态
  const initializeWords = useCallback((word?: Word) => {
    const wordText = word?.word || '';
    const wordArray = wordText.split(' ');
    const newWords = wordArray.map((text, index) => ({
      id: index,
      text,
      userInput: '',
      isActive: index === 0,
      incorrect: false,
      completed: false
    }));
    setWords(newWords);
    setCurrentWordIndex(0);
  }, []);

  // 更新单词输入
  const updateWordInput = useCallback((index: number, input: string) => {
    setWords(prevWords =>
      prevWords.map((word, i) =>
        i === index
          ? {
              ...word,
              userInput: input,
              completed: input.trim() === word.text
            }
          : word
      )
    );
  }, []);

  // 设置活跃单词
  const setActiveWord = useCallback((index: number) => {
    setWords(prevWords =>
      prevWords.map((word, i) => ({
        ...word,
        isActive: i === index
      }))
    );
    setCurrentWordIndex(index);
  }, []);

  // 设置单词错误状态
  const setWordError = useCallback((index: number, hasError: boolean) => {
    setWords(prevWords =>
      prevWords.map((word, i) =>
        i === index ? { ...word, incorrect: hasError } : word
      )
    );
  }, []);

  // 设置单词完成状态
  const setWordCompleted = useCallback((index: number, completed: boolean) => {
    setWords(prevWords =>
      prevWords.map((word, i) =>
        i === index
          ? {
              ...word,
              completed,
              userInput: completed ? word.text : word.userInput,
              incorrect: false
            }
          : word
      )
    );
  }, []);

  // 重置单词状态
  const resetWords = useCallback(() => {
    setWords(prevWords =>
      prevWords.map((word, index) => ({
        ...word,
        userInput: '',
        isActive: index === 0,
        incorrect: false,
        completed: false
      }))
    );
    setCurrentWordIndex(0);
  }, []);

  // 查找下一个未完成的单词
  const findNextIncompleteWord = useCallback(
    (fromIndex: number): number => {
      // 从当前位置向右查找
      for (let i = fromIndex + 1; i < words.length; i++) {
        if (!words[i].completed && isWord(words[i].text)) {
          return i;
        }
      }
      // 从左边查找
      for (let i = 0; i < fromIndex; i++) {
        if (!words[i].completed && isWord(words[i].text)) {
          return i;
        }
      }
      return -1;
    },
    [words]
  );

  // 查找上一个未完成的单词
  const findPrevIncompleteWord = useCallback(
    (fromIndex: number): number => {
      // 从当前位置向左查找
      for (let i = fromIndex - 1; i >= 0; i--) {
        if (isWord(words[i].text)) {
          return i;
        }
      }
      return -1;
    },
    [words]
  );

  return {
    words,
    currentWordIndex,
    initializeWords,
    updateWordInput,
    setActiveWord,
    setWordError,
    setWordCompleted,
    resetWords,
    findNextIncompleteWord,
    findPrevIncompleteWord
  };
};
