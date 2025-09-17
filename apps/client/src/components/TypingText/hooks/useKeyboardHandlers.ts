import { RefObject, useCallback, useRef, useMemo } from 'react';
import { specialKeys } from '@/constant';
import { playWordAudio } from '@/hooks/useSpeech';
import { useTypingSound } from '@/hooks/useTypingSound';
import { KEYBOARD_SHORTCUTS, IS_MAC } from '../constants';
import { UseKeyboardHandlersReturn, WordState } from '../types';
import { Word } from '@/request/globals';
import { debounce } from '@/utils';

interface UseKeyboardHandlersProps {
  inputRef: RefObject<HTMLInputElement | null>;
  words: WordState[];
  currentWordIndex: number;
  inputValue: string;
  word?: Word;
  isComposing: boolean;
  isAllCorrect: boolean;
  onInputChange: (value: string) => void;
  onSubmitAnswer: () => void;
  onResetExercise: () => void;
  onToggleHint: () => void;
  onNavigateWord: (direction: 'left' | 'right') => void;
  onJumpToFirst: () => void;
  onJumpToLast: () => void;
  onClearInput: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const useKeyboardHandlers = ({
  inputRef,
  words,
  currentWordIndex,
  inputValue,
  word,
  isComposing,
  isAllCorrect,
  onInputChange,
  onSubmitAnswer,
  onResetExercise,
  onToggleHint,
  onNavigateWord,
  onJumpToFirst,
  onJumpToLast,
  onClearInput,
  onNext,
  onPrev
}: UseKeyboardHandlersProps): UseKeyboardHandlersReturn => {
  const { playTypingSound } = useTypingSound();
  const hasErrorRef = useRef(false);
  const isComposingRef = useRef(false);

  // 播放单词发音的实际函数
  const playWordAudioInternal = useCallback(async () => {
    if (word?.word) {
      try {
        await playWordAudio(word);
      } catch {
        // 静默处理错误
      }
    }
  }, [word]);

  // 使用 debounce 包装播放函数
  const playWordPronunciation = useMemo(
    () => debounce(playWordAudioInternal, 500),
    [playWordAudioInternal]
  );

  // 防抖版本的快捷键处理函数
  const debouncedResetExercise = useMemo(
    () =>
      debounce(() => {
        onResetExercise();
        inputRef.current?.focus();
      }, 300),
    [onResetExercise, inputRef]
  );

  const debouncedToggleHint = useMemo(
    () =>
      debounce(() => {
        onToggleHint();
        inputRef.current?.focus();
      }, 300),
    [onToggleHint, inputRef]
  );

  const debouncedNavigateWord = useMemo(
    () =>
      debounce((direction: 'left' | 'right') => {
        onNavigateWord(direction);
        inputRef.current?.focus();
      }, 200),
    [onNavigateWord, inputRef]
  );

  const debouncedJumpToFirst = useMemo(
    () =>
      debounce(() => {
        onJumpToFirst();
        inputRef.current?.focus();
      }, 200),
    [onJumpToFirst, inputRef]
  );

  const debouncedJumpToLast = useMemo(
    () =>
      debounce(() => {
        onJumpToLast();
        inputRef.current?.focus();
      }, 200),
    [onJumpToLast, inputRef]
  );

  const debouncedClearInput = useMemo(
    () =>
      debounce(() => {
        onClearInput();
        inputRef.current?.focus();
      }, 200),
    [onClearInput, inputRef]
  );

  const debouncedNextWord = useMemo(
    () =>
      debounce(() => {
        onNext?.();
        inputRef.current?.focus();
      }, 300),
    [onNext, inputRef]
  );

  const debouncedPrevWord = useMemo(
    () =>
      debounce(() => {
        onPrev?.();
        inputRef.current?.focus();
      }, 300),
    [onPrev, inputRef]
  );

  // 处理退格键逻辑
  const handleBackspace = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, isCtrl: boolean) => {
      if (isCtrl) {
        e.preventDefault();
        onInputChange('');
        return;
      }

      // 普通退格键：如果当前输入为空且不是第一个单词，则切换到前一个单词
      if (inputValue === '' && currentWordIndex > 0) {
        e.preventDefault();
        const prevIndex = currentWordIndex - 1;
        const prevWord = words[prevIndex];

        if (prevWord) {
          const newInputValue = prevWord.userInput.slice(0, -1);
          onNavigateWord('left');
          onInputChange(newInputValue);
        }
      }
    },
    [inputValue, currentWordIndex, words, onInputChange, onNavigateWord]
  );

  // 处理提交键（空格和回车）
  const handleSubmitKeys = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // 如果当前有错误，清空输入重新开始
      if (hasErrorRef.current) {
        onInputChange('');
        hasErrorRef.current = false;
        return;
      }

      // 正常提交答案
      onSubmitAnswer();
      inputRef.current?.focus();
    },
    [onInputChange, onSubmitAnswer, inputRef]
  );

  // 主键盘事件处理器
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentWord = words[currentWordIndex];

      // 播放打字音效
      const shouldPlayTypingSound =
        inputValue.trim() === currentWord?.text ||
        (e.key !== ' ' && e.key !== 'Enter');

      if (specialKeys.includes(e.key.toUpperCase()) && shouldPlayTypingSound) {
        playTypingSound();
      }

      // 处理快捷键 (根据系统使用Ctrl或Cmd键)
      const isModifierPressed = IS_MAC ? e.metaKey : e.ctrlKey;

      if (isModifierPressed) {
        switch (e.key) {
          case KEYBOARD_SHORTCUTS.RESET_EXERCISE:
            e.preventDefault();
            debouncedResetExercise();
            return;
          case KEYBOARD_SHORTCUTS.TOGGLE_HINT:
            e.preventDefault();
            debouncedToggleHint();
            return;
          case KEYBOARD_SHORTCUTS.PRONUNCIATION:
            e.preventDefault();
            playWordPronunciation();
            inputRef.current?.focus();
            return;
          case KEYBOARD_SHORTCUTS.NAVIGATION_KEYS.BACKSPACE:
            handleBackspace(e, true);
            inputRef.current?.focus();
            return;
        }
      }

      // Command/Ctrl组合键处理（根据操作系统）
      if (isModifierPressed) {
        if (e.key === KEYBOARD_SHORTCUTS.WORD_NAVIGATION.PREV) {
          e.preventDefault();
          debouncedNextWord();
          return;
        }
        if (e.key === KEYBOARD_SHORTCUTS.WORD_NAVIGATION.NEXT) {
          e.preventDefault();
          debouncedPrevWord();
          return;
        }
      }

      // 导航键处理
      switch (e.key) {
        case KEYBOARD_SHORTCUTS.NAVIGATION_KEYS.LEFT:
        case KEYBOARD_SHORTCUTS.NAVIGATION_KEYS.RIGHT:
          e.preventDefault();
          debouncedNavigateWord(
            e.key === KEYBOARD_SHORTCUTS.NAVIGATION_KEYS.LEFT ? 'left' : 'right'
          );
          return;
        case KEYBOARD_SHORTCUTS.NAVIGATION_KEYS.HOME:
          e.preventDefault();
          debouncedJumpToFirst();
          return;
        case KEYBOARD_SHORTCUTS.NAVIGATION_KEYS.END:
          e.preventDefault();
          debouncedJumpToLast();
          return;
        case KEYBOARD_SHORTCUTS.NAVIGATION_KEYS.ESCAPE:
          e.preventDefault();
          debouncedClearInput();
          return;
        case KEYBOARD_SHORTCUTS.NAVIGATION_KEYS.BACKSPACE:
          handleBackspace(e, false);
          inputRef.current?.focus();
          return;
      }

      // 提交键处理
      if (
        (e.key === KEYBOARD_SHORTCUTS.SUBMIT_KEYS.SPACE ||
          e.key === KEYBOARD_SHORTCUTS.SUBMIT_KEYS.ENTER) &&
        !isComposing &&
        !isAllCorrect
      ) {
        handleSubmitKeys(e);
        inputRef.current?.focus();
        return;
      }
    },
    [
      words,
      currentWordIndex,
      inputValue,
      isComposing,
      isAllCorrect,
      playTypingSound,
      debouncedResetExercise,
      debouncedToggleHint,
      playWordPronunciation,
      handleBackspace,
      debouncedNextWord,
      debouncedPrevWord,
      debouncedNavigateWord,
      debouncedJumpToFirst,
      debouncedJumpToLast,
      debouncedClearInput,
      handleSubmitKeys,
      inputRef
    ]
  );

  // 输入法事件处理
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
  }, []);

  // 全局键盘事件处理器（用于容器div）
  const handleGlobalKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // 处理快捷键 (根据系统使用Ctrl或Cmd键)
      const isModifierPressed = IS_MAC ? e.metaKey : e.ctrlKey;

      if (isModifierPressed) {
        switch (e.key) {
          case KEYBOARD_SHORTCUTS.RESET_EXERCISE:
            e.preventDefault();
            debouncedResetExercise();
            return;
          case KEYBOARD_SHORTCUTS.TOGGLE_HINT:
            e.preventDefault();
            debouncedToggleHint();
            return;
          case KEYBOARD_SHORTCUTS.PRONUNCIATION:
            e.preventDefault();
            playWordPronunciation();
            inputRef.current?.focus();
            return;
        }
      }

      // Shift组合键处理
      if (e.ctrlKey || e.metaKey) {
        if (e.key === KEYBOARD_SHORTCUTS.WORD_NAVIGATION.PREV) {
          e.preventDefault();
          debouncedPrevWord();
          return;
        }
        if (e.key === KEYBOARD_SHORTCUTS.WORD_NAVIGATION.NEXT) {
          e.preventDefault();
          debouncedNextWord();
          return;
        }
      }
      // 全部完成的时候空格键或者回车，切换到下一个单词
      if (isAllCorrect) {
        if (
          e.key === KEYBOARD_SHORTCUTS.SUBMIT_KEYS.SPACE ||
          e.key === KEYBOARD_SHORTCUTS.SUBMIT_KEYS.ENTER
        ) {
          e.preventDefault();
          debouncedNextWord();
          return;
        }
      }
    },
    [
      debouncedResetExercise,
      debouncedToggleHint,
      playWordPronunciation,
      debouncedNextWord,
      debouncedPrevWord,
      isAllCorrect,
      inputRef
    ]
  );

  return {
    handleKeyDown,
    handleGlobalKeyDown,
    handleCompositionStart,
    handleCompositionEnd
  };
};
