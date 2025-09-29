import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Word } from '@/request/globals';
import { playWordAudio } from '@/hooks/useSpeech';
import { useTypingSound } from '@/hooks/useTypingSound';
import { useWordState } from './useWordState';
import { useKeyboardHandlers } from './useKeyboardHandlers';
import { isWord, debounce } from '@/utils';
import { GameMode } from '@/components/GameModeModal/types';
import { UserSettings } from '@/types';

interface UseTypingLogicProps {
  mode?: GameMode;
  word?: Word;
  userSettings?: UserSettings;
  onComplete?: (isCorrect: boolean) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const useTypingLogic = ({
  mode = 'dictation',
  word,
  userSettings,
  onComplete,
  onNext,
  onPrev
}: UseTypingLogicProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing] = useState(false);
  const [showAnswerTip, setShowAnswerTip] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const hasErrorRef = useRef(false);
  const [hasShownError, setHasShownError] = useState(false);

  const { playSuccessSound, playErrorSound } = useTypingSound(userSettings);

  // 处理翻译模式下的单词属性转换
  const processedWord = useMemo(() => {
    if (!word) return word;

    if (mode === 'translation') {
      return {
        ...word,
        word: word.meaningShort || word.meaning || '',
        meaning: word.word || ''
      };
    }
    return word;
  }, [word, mode]);

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
  } = useWordState(processedWord);

  // 播放单词发音的实际函数
  const playWordAudioInternal = useCallback(async () => {
    if (word?.word) {
      try {
        await playWordAudio(word, userSettings);
      } catch {
        // 静默处理错误
      }
    }
  }, [word, userSettings]);

  // 使用 debounce 包装播放函数
  const playWordPronunciation = useMemo(
    () => debounce(playWordAudioInternal, 500),
    [playWordAudioInternal]
  );

  // 处理输入变化
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // 避免用户输入过长
      if (value.length > 15) {
        return;
      }
      setInputValue(value);

      // 如果用户开始输入，清除错误状态
      if (hasErrorRef.current && value.length > 0) {
        hasErrorRef.current = false;
        setWordError(currentWordIndex, false);
        setHasShownError(false);
      }

      // 更新当前单词的用户输入
      updateWordInput(currentWordIndex, value);
    },
    [currentWordIndex, updateWordInput, setWordError]
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
      onComplete?.(false);
      playErrorSound();
      hasErrorRef.current = true;
      setWordError(currentWordIndex, true);

      // 如果已经显示过错误，则清空输入内容
      if (hasShownError) {
        setInputValue('');
        updateWordInput(currentWordIndex, '');
        setHasShownError(false);
      } else {
        // 第一次错误，只显示错误提示
        setHasShownError(true);
      }

      // 确保输入框保持聚焦
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [
    words,
    currentWordIndex,
    inputValue,
    setWordError,
    setWordCompleted,
    playSuccessSound,
    onComplete,
    findNextIncompleteWord,
    setActiveWord,
    playErrorSound,
    hasShownError,
    updateWordInput
  ]);

  // 重置练习
  const resetExercise = useCallback(() => {
    resetWords();
    setInputValue('');
    hasErrorRef.current = false;
    setShowAnswerTip(false);
    setIsAllCorrect(false);
    setHasShownError(false);
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
      } else {
        console.log('no target word found');
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
    inputRef,
    words,
    currentWordIndex,
    inputValue,
    word,
    isComposing,
    isAllCorrect,
    userSettings,
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
    initializeWords(processedWord);
    setInputValue('');
    hasErrorRef.current = false;
    setShowAnswerTip(false);
    setIsAllCorrect(false);
    setHasShownError(false);
    // 静默翻译模式：只看到母语提示，不提供音频和翻译，用户需要输入对应的外语内容。
    if (mode !== 'silentTranslation') {
      playWordPronunciation();
    }
  }, [word, mode, processedWord, initializeWords, playWordPronunciation]);

  const onResetExercise = useCallback(() => {
    resetExercise();
  }, [resetExercise]);

  const onToggleHint = useCallback(() => {
    toggleHint();
  }, [toggleHint]);

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
    isFocused,
    isComposing,

    // 事件处理器
    setIsFocused,
    handleInputChange,
    handleKeyDown: keyboardHandlers.handleKeyDown,
    handleGlobalKeyDown: keyboardHandlers.handleGlobalKeyDown,
    handleCompositionStart: keyboardHandlers.handleCompositionStart,
    handleCompositionEnd: keyboardHandlers.handleCompositionEnd,
    preventCursorMove,
    onNext,
    onPrev,
    onResetExercise,
    playWordPronunciation,
    onToggleHint,
    submitAnswer
  };
};
