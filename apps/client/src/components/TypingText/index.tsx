'use client';
import React, { useState, useEffect, useRef } from 'react';

interface WordPair {
  word: string;
  mean: string;
}

interface TypingTextProps {
  wordPair?: WordPair;
  className?: string;
  onComplete?: (isCorrect: boolean) => void;
}

interface WordState {
  id: number;
  text: string;
  userInput: string;
  isActive: boolean;
  incorrect: boolean;
  completed: boolean;
}

export default function TypingText({
  wordPair: propWordPair,
  onComplete
}: TypingTextProps) {
  const wordPair = propWordPair || {
    word: "I don't like to do it now",
    mean: '我不喜欢现在做'
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const [showAnswerTip, setShowAnswerTip] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 预加载音频对象，避免每次创建
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化单词状态
  const initializeWords = (): WordState[] => {
    const words = wordPair.word.split(' ');
    return words.map((word, index) => ({
      id: index,
      text: word,
      userInput: '',
      isActive: index === 0,
      incorrect: false,
      completed: false
    }));
  };

  const [words, setWords] = useState<WordState[]>(initializeWords());

  // 判断是否为单词（非标点符号）
  const isWord = (text: string): boolean => {
    // 支持英文、中文、日文、韩文、俄文等多种语言
    return /^[\p{L}\p{M}']+$/u.test(text);
  };

  // 获取单词宽度
  const getWordWidth = (word: string): number => {
    return Math.max(word.length, 4);
  };

  // 获取单词样式类名
  const getWordsClassNames = (word: WordState): string => {
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

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // 如果用户开始输入，清除错误状态
    if (hasError && value.length > 0) {
      setHasError(false);
      // 同时清除当前单词的错误状态
      setWords(prevWords =>
        prevWords.map(word =>
          word.isActive ? { ...word, incorrect: false } : word
        )
      );
    }

    // 更新当前单词的用户输入
    setWords(prevWords =>
      prevWords.map(word =>
        word.isActive
          ? {
              ...word,
              userInput: value
            }
          : word
      )
    );
  };

  // 提交答案
  const submitAnswer = () => {
    const currentWord = words[currentWordIndex];
    if (!currentWord) {
      // 设置错误状态，将当前输入标记为错误
      setHasError(true);
      setWords(prevWords =>
        prevWords.map(word =>
          word.isActive ? { ...word, incorrect: true } : word
        )
      );
      return;
    }

    const isCorrect = inputValue.trim() === currentWord.text;

    if (isCorrect) {
      // 清除错误状态
      setHasError(false);

      // 标记当前单词为完成
      setWords(prevWords =>
        prevWords.map(word =>
          word.isActive
            ? {
                ...word,
                completed: true,
                isActive: false,
                userInput: word.text
              }
            : word
        )
      );

      // 移动到下一个单词
      if (currentWordIndex < words.length - 1) {
        const nextIndex = currentWordIndex + 1;
        setCurrentWordIndex(nextIndex);
        setWords(prevWords =>
          prevWords.map((word, index) =>
            index === nextIndex ? { ...word, isActive: true } : word
          )
        );
        setInputValue('');
      } else {
        // 所有单词完成
        playSuccessSound();
        setInputValue('');
        onComplete?.(true);
      }
    } else {
      // 播放错误音效
      playErrorSound();
      // 设置错误状态
      setHasError(true);

      // 标记错误
      setWords(prevWords =>
        prevWords.map(word =>
          word.isActive ? { ...word, incorrect: true } : word
        )
      );

      // 确保输入框保持聚焦以显示错误状态
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playTypingSound();
    // 处理退格键删除整个单词（Ctrl+Backspace）
    if (e.key === 'Backspace' && e.ctrlKey) {
      e.preventDefault();
      setInputValue('');
      return;
    }

    // Enter 键 空格键 处理
    if ((e.key === 'Enter' || e.key === ' ') && !isComposing) {
      e.preventDefault();
      e.stopPropagation();

      // 如果当前有错误，清空输入重新开始
      if (hasError) {
        setInputValue('');
        setHasError(false);
        // 清除当前单词的错误状态
        setWords(prevWords =>
          prevWords.map(word =>
            word.isActive ? { ...word, incorrect: false, userInput: '' } : word
          )
        );
        return;
      }

      // 正常提交答案
      submitAnswer();
      return;
    }
  };

  // 处理输入法事件
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // 防止鼠标移动光标
  const preventCursorMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 重置游戏
  const resetGame = () => {
    setWords(initializeWords());
    setCurrentWordIndex(0);
    setInputValue('');
    setShowAnswerTip(false);
    setHasError(false); // 重置错误状态
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 初始化音频对象
  useEffect(() => {
    try {
      typingAudioRef.current = new Audio('/sounds/typing.mp3');
      typingAudioRef.current.volume = 0.3;
      typingAudioRef.current.preload = 'auto';

      successAudioRef.current = new Audio('/sounds/right.mp3');
      successAudioRef.current.volume = 0.5;
      successAudioRef.current.preload = 'auto';

      errorAudioRef.current = new Audio('/sounds/error.mp3');
      errorAudioRef.current.volume = 0.5;
      errorAudioRef.current.preload = 'auto';
    } catch (e) {
      console.log('初始化音频失败:', e);
    }
  }, []);

  // 播放声音函数
  const playTypingSound = () => {
    if (typingAudioRef.current) {
      typingAudioRef.current.currentTime = 0; // 重置播放位置
      typingAudioRef.current
        .play()
        .catch(e => console.log('播放成功音效失败:', e));
    }
  };

  const playSuccessSound = () => {
    if (successAudioRef.current) {
      successAudioRef.current.currentTime = 0; // 重置播放位置
      successAudioRef.current
        .play()
        .catch(e => console.log('播放成功音效失败:', e));
    }
  };

  const playErrorSound = () => {
    if (errorAudioRef.current) {
      errorAudioRef.current.currentTime = 0; // 重置播放位置
      errorAudioRef.current
        .play()
        .catch(e => console.log('播放错误音效失败:', e));
    }
  };

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

  return (
    <div className='max-w-7xl mx-auto px-4 flex-1 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center text-white'>
      <div className='flex flex-col justify-center items-center gap-y-8'>
        {/* 中文翻译 */}
        <div className='text-2xl text-center mb-4'>{wordPair.mean}</div>

        {/* 单词显示区域 */}
        <div className='text-center'>
          <div className='relative flex flex-wrap justify-center gap-2 transition-all'>
            {words.map((word, index) =>
              isWord(word.text) ? (
                <div
                  key={index}
                  className={`h-16 rounded-sm border-b-2 border-solid text-5xl leading-none transition-all ${getWordsClassNames(
                    word
                  )}`}
                  style={{ minWidth: `${getWordWidth(word.text)}ch` }}>
                  {word.userInput || (showAnswerTip ? word.text : '')}
                </div>
              ) : (
                <div
                  key={index}
                  className='h-16 rounded-sm text-5xl leading-none transition-all text-white'>
                  {word.text}
                </div>
              )
            )}

            {/* 隐藏的输入框 */}
            <input
              ref={inputRef}
              className='absolute h-full w-full opacity-0'
              type='text'
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onMouseDown={preventCursorMove}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export type { WordPair, TypingTextProps };
