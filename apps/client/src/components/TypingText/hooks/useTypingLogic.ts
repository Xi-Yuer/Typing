import { useState, useEffect, useRef, useCallback } from 'react';
import { Word } from '@/request/globals';
import { playWordAudio } from '@/hooks/useSpeech';
import { useTypingSound } from '@/hooks/useTypingSound';
import { useWordState } from './useWordState';
import { useKeyboardHandlers } from './useKeyboardHandlers';
import { isWord } from '@/utils';

interface UseTypingLogicProps {
  word?: Word;
  onComplete?: (isCorrect: boolean) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const useTypingLogic = ({
  word,
  onComplete,
  onNext,
  onPrev
}: UseTypingLogicProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [showAnswerTip, setShowAnswerTip] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const hasErrorRef = useRef(false);

  const { playSuccessSound, playErrorSound } = useTypingSound();

  const {
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
  } = useWordState(word);

  // 播放单词发音
  const playWordPronunciation = useCallback(async () => {
    if (word?.word) {
      try {
        await playWordAudio(word);
      } catch (error) {
        // 静默处理错误
      }
    }
  }, [word?.word]);

  // 处理输入变化
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setInputValue(value);

      // 如果用户开始输入，清除错误状态
      if (hasErrorRef.current && value.length > 0) {
        hasErrorRef.current = false;
        setWordError(currentWordIndex, false);
      }

      // 更新当前单词的用户输入
      updateWordInput(currentWordIndex, value);
    },
    [words, currentWordIndex, updateWordInput, setWordError, playErrorSound]
  );

  // 提交答案
  const submitAnswer = useCallback(() => {
    const currentWord = words[currentWordIndex];
    if (!currentWord) {
      hasErrorRef.current = true;
      setWordError(currentWordIndex, true);
      return;
    }

    const isCorrect = inputValue.trim() === currentWord.text;

    if (isCorrect) {
      hasErrorRef.current = false;
      setWordCompleted(currentWordIndex, true);

      // 检查是否所有单词都已完成
      const allCompleted = words.every(
        (word, index) =>
          index === currentWordIndex || word.completed || !isWord(word.text)
      );

      if (allCompleted) {
        playSuccessSound();
        setInputValue('');
        onComplete?.(true);
        setIsAllCorrect(true);
      } else {
        // 移动到下一个未完成的单词
        const nextIndex = findNextIncompleteWord(currentWordIndex);
        if (nextIndex !== -1) {
          setActiveWord(nextIndex);
          setInputValue(words[nextIndex].userInput);
        }
      }
    } else {
      playErrorSound();
      hasErrorRef.current = true;
      setWordError(currentWordIndex, true);

      // 确保输入框保持聚焦
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [
    words,
    currentWordIndex,
    inputValue,
    setWordCompleted,
    setWordError,
    findNextIncompleteWord,
    setActiveWord,
    playSuccessSound,
    playErrorSound,
    onComplete
  ]);

  // 重置练习
  const resetExercise = useCallback(() => {
    resetWords();
    setInputValue('');
    hasErrorRef.current = false;
    setShowAnswerTip(false);
    setIsAllCorrect(false);
  }, [resetWords]);

  // 切换提示
  const toggleHint = useCallback(() => {
    setShowAnswerTip(!showAnswerTip);
  }, [showAnswerTip]);

  // 导航到单词
  const navigateWord = useCallback(
    (direction: 'left' | 'right') => {
      let targetIndex = -1;

      if (direction === 'left') {
        targetIndex = findPrevIncompleteWord(currentWordIndex);
      } else {
        // 查找下一个单词（不限于未完成）
        for (let i = currentWordIndex + 1; i < words.length; i++) {
          if (isWord(words[i].text)) {
            targetIndex = i;
            break;
          }
        }
      }

      if (targetIndex !== -1) {
        setActiveWord(targetIndex);
        setInputValue(words[targetIndex].userInput);
        hasErrorRef.current = false;
      }
    },
    [currentWordIndex, words, findPrevIncompleteWord, setActiveWord]
  );

  // 跳转到第一个未完成的单词
  const jumpToFirstIncomplete = useCallback(() => {
    const firstIncompleteIndex = words.findIndex(
      word => !word.completed && isWord(word.text)
    );
    if (
      firstIncompleteIndex !== -1 &&
      firstIncompleteIndex !== currentWordIndex
    ) {
      setActiveWord(firstIncompleteIndex);
      setInputValue(words[firstIncompleteIndex]?.userInput || '');
      hasErrorRef.current = false;
    }
  }, [words, currentWordIndex, setActiveWord]);

  // 跳转到最后一个未完成的单词
  const jumpToLastIncomplete = useCallback(() => {
    const incompleteIndices = words
      .map((word, index) => ({ word, index }))
      .filter(({ word }) => !word.completed && isWord(word.text))
      .map(({ index }) => index);

    const lastIncompleteIndex = incompleteIndices[incompleteIndices.length - 1];
    if (
      lastIncompleteIndex !== undefined &&
      lastIncompleteIndex !== currentWordIndex
    ) {
      setActiveWord(lastIncompleteIndex);
      setInputValue(words[lastIncompleteIndex]?.userInput || '');
      hasErrorRef.current = false;
    }
  }, [words, currentWordIndex, setActiveWord]);

  // 清除当前输入
  const clearCurrentInput = useCallback(() => {
    setInputValue('');
    hasErrorRef.current = false;
    updateWordInput(currentWordIndex, '');
    setWordError(currentWordIndex, false);
    setWordCompleted(currentWordIndex, false);
  }, [currentWordIndex, updateWordInput, setWordError, setWordCompleted]);

  // 防止鼠标移动光标
  const preventCursorMove = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 键盘处理器
  const keyboardHandlers = useKeyboardHandlers({
    words,
    currentWordIndex,
    inputValue,
    word,
    isComposing,
    onInputChange: (value: string) => {
      setInputValue(value);
      updateWordInput(currentWordIndex, value);
    },
    onSubmitAnswer: submitAnswer,
    onResetExercise: resetExercise,
    onToggleHint: toggleHint,
    onNavigateWord: navigateWord,
    onJumpToFirst: jumpToFirstIncomplete,
    onJumpToLast: jumpToLastIncomplete,
    onClearInput: clearCurrentInput,
    onNext,
    onPrev
  });

  // 监听外部传入的 word 变化
  useEffect(() => {
    initializeWords(word);
    setInputValue('');
    hasErrorRef.current = false;
    setShowAnswerTip(false);
    setIsAllCorrect(false);
    playWordPronunciation();
  }, [word, initializeWords, playWordPronunciation]);

  // 自动聚焦
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWordIndex]);

  // 窗口聚焦时自动聚焦输入框
  useEffect(() => {
    const handleWindowFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return {
    // 状态
    words,
    inputValue,
    isAllCorrect,
    showAnswerTip,
    inputRef,

    // 事件处理器
    handleInputChange,
    preventCursorMove,
    ...keyboardHandlers
  };
};
