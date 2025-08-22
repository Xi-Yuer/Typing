'use client';
import { specialKeys } from '@/constant';
import useSpeech from '@/hooks/useSpeech';
import { useTypingSound } from '@/hooks/useTypingSound';
import { Word } from '@/request/globals';
import { getWordsClassNames, getWordWidth, isWord } from '@/utils';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useState, useEffect, useRef } from 'react';

interface TypingTextProps {
  word?: Word;
  className?: string;
  onComplete?: (isCorrect: boolean) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export interface WordState {
  id: number;
  text: string;
  userInput: string;
  isActive: boolean;
  incorrect: boolean;
  completed: boolean;
}

const TypingText = function ({
  word,
  onComplete,
  onNext,
  onPrev
}: TypingTextProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const [showAnswerTip, setShowAnswerTip] = useState(false);
  const hasErrorRef = useRef(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const { speak, speaking, cancel } = useSpeech(word?.word || '');
  const { playTypingSound, playSuccessSound, playErrorSound } =
    useTypingSound();

  // 初始化单词状态
  const initializeWords = (): WordState[] => {
    const words = word?.word?.split(' ') || [];
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

  // 监听外部传入的 word 变化，重新初始化组件状态
  useEffect(() => {
    const newWords = initializeWords();
    setWords(newWords);
    setCurrentWordIndex(0);
    setInputValue('');
    hasErrorRef.current = false;
    setShowAnswerTip(false);
    setIsAllCorrect(false);
  }, [word]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 获取当前活跃单词
    const currentWord = words.find(word => word.isActive);

    // 如果输入长度超过当前单词长度，显示错误并阻止输入
    if (currentWord && value.length > currentWord.text.length) {
      hasErrorRef.current = true;
      setWords(prevWords =>
        prevWords.map(word =>
          word.isActive ? { ...word, incorrect: true } : word
        )
      );
      playErrorSound();
      return; // 阻止继续处理
    }

    setInputValue(value);

    // 如果用户开始输入，清除错误状态
    if (hasErrorRef.current && value.length > 0) {
      hasErrorRef.current = false;
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
              userInput: value,
              // 如果输入完全匹配，标记为完成；如果不匹配且有输入，清除完成状态
              completed: value.trim() === word.text,
              // 清除错误状态（如果有输入的话）
              incorrect: false
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
      hasErrorRef.current = true;
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
      hasErrorRef.current = false;

      // 标记当前单词为完成
      setWords(prevWords =>
        prevWords.map(word =>
          word.isActive
            ? {
                ...word,
                completed: true,
                userInput: word.text,
                incorrect: false
              }
            : word
        )
      );

      // 检查是否所有单词都已完成（只检查真正的单词，忽略标点符号）
      const allCompleted = words.every(
        (word, index) =>
          index === currentWordIndex || word.completed || !isWord(word.text)
      );

      if (allCompleted) {
        // 所有单词完成
        playSuccessSound();
        setInputValue('');
        onComplete?.(true);
        setIsAllCorrect(true);
      } else {
        // 寻找下一个未完成的单词（跳过标点符号）
        let nextIndex = -1;
        for (let i = currentWordIndex + 1; i < words.length; i++) {
          if (!words[i].completed && isWord(words[i].text)) {
            nextIndex = i;
            break;
          }
        }

        // 如果右边没有未完成的单词，从左边找
        if (nextIndex === -1) {
          for (let i = 0; i < currentWordIndex; i++) {
            if (!words[i].completed && isWord(words[i].text)) {
              nextIndex = i;
              break;
            }
          }
        }

        // 移动到下一个未完成的单词
        if (nextIndex !== -1) {
          setCurrentWordIndex(nextIndex);
          setWords(prevWords =>
            prevWords.map((word, index) => ({
              ...word,
              isActive: index === nextIndex
            }))
          );
          setInputValue(words[nextIndex].userInput);
        }
      }
    } else {
      // 播放错误音效
      playErrorSound();
      // 设置错误状态
      hasErrorRef.current = true;

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
    // 按键播放打字音效
    const currentWord = words[currentWordIndex];
    const isPlayTypingSound =
      inputValue.trim() === currentWord.text ||
      (e.key !== ' ' && e.key !== 'Enter');
    if (specialKeys.includes(e.key.toUpperCase()) && isPlayTypingSound) {
      playTypingSound();
    }
    // Ctrl + R: 重置整个练习
    if (e.ctrlKey && e.key === 'r') {
      e.preventDefault();
      resetExercise();
      return;
    }

    // Ctrl + H: 切换答案提示
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      setShowAnswerTip(!showAnswerTip);
      setTimeout(() => {
        setShowAnswerTip(false);
      }, 1500);
      return;
    }

    // Home: 跳转到第一个未完成的单词
    if (e.key === 'Home') {
      e.preventDefault();
      jumpToFirstIncomplete();
      return;
    }

    // End: 跳转到最后一个未完成的单词
    if (e.key === 'End') {
      e.preventDefault();
      jumpToLastIncomplete();
      return;
    }

    // Escape: 清除当前输入和错误状态
    if (e.key === 'Escape') {
      e.preventDefault();
      clearCurrentInput();
      return;
    }

    // 左右键切换单词
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();

      if (e.key === 'ArrowLeft') {
        // 切换到上一个单词（跳过标点符号）
        let prevIndex = -1;
        for (let i = currentWordIndex - 1; i >= 0; i--) {
          if (isWord(words[i].text)) {
            prevIndex = i;
            break;
          }
        }

        if (prevIndex !== -1) {
          setCurrentWordIndex(prevIndex);

          // 更新单词状态
          setWords(prevWords =>
            prevWords.map((word, index) => ({
              ...word,
              isActive: index === prevIndex
            }))
          );

          // 设置输入框的值为目标单词的当前输入
          const targetWord = words[prevIndex];
          setInputValue(targetWord.userInput);

          // 清除错误状态
          hasErrorRef.current = false;
        }
      } else if (e.key === 'ArrowRight') {
        // 切换到下一个单词（跳过标点符号）
        let nextIndex = -1;
        for (let i = currentWordIndex + 1; i < words.length; i++) {
          if (isWord(words[i].text)) {
            nextIndex = i;
            break;
          }
        }

        if (nextIndex !== -1) {
          setCurrentWordIndex(nextIndex);

          // 更新单词状态
          setWords(prevWords =>
            prevWords.map((word, index) => ({
              ...word,
              isActive: index === nextIndex
            }))
          );

          // 设置输入框的值为目标单词的当前输入
          const targetWord = words[nextIndex];
          setInputValue(targetWord.userInput);

          // 清除错误状态
          hasErrorRef.current = false;
        }
      }
      return;
    }

    // 处理退格键
    if (e.key === 'Backspace') {
      // Ctrl+Backspace：删除整个单词
      if (e.ctrlKey) {
        e.preventDefault();
        setInputValue('');
        // 清除当前单词的用户输入
        setWords(prevWords =>
          prevWords.map(word =>
            word.isActive
              ? { ...word, userInput: '', incorrect: false, completed: false }
              : word
          )
        );
        return;
      }

      // 普通退格键：如果当前输入为空且不是第一个单词，则切换到前一个单词并删除其最后一个字符
      if (inputValue === '' && currentWordIndex > 0) {
        e.preventDefault();

        const prevIndex = currentWordIndex - 1;
        const prevWord = words[prevIndex];

        // 切换到前一个单词
        setCurrentWordIndex(prevIndex);

        // 更新单词状态
        setWords(prevWords =>
          prevWords.map((word, index) => {
            if (index === prevIndex) {
              // 删除前一个单词的最后一个字符
              const newUserInput = word.userInput.slice(0, -1);
              return {
                ...word,
                isActive: true,
                userInput: newUserInput,
                completed: newUserInput.trim() === word.text,
                incorrect: false
              };
            } else if (index === currentWordIndex) {
              // 当前单词变为非激活状态
              return {
                ...word,
                isActive: false
              };
            }
            return word;
          })
        );

        // 设置输入框的值为前一个单词删除最后一个字符后的内容
        const newInputValue = prevWord.userInput.slice(0, -1);
        setInputValue(newInputValue);

        // 清除错误状态
        hasErrorRef.current = false;
        return;
      }
    }

    // Enter 键 空格键 处理
    if ((e.key === 'Enter' || e.key === ' ') && !isComposing) {
      e.preventDefault();
      e.stopPropagation();

      // 如果当前有错误，清空输入重新开始
      if (hasErrorRef.current) {
        setInputValue('');
        hasErrorRef.current = false;
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

    // Shift 键 左键
    if (e.shiftKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      onNext && onNext();
      return;
    }

    // Shift 键 右键
    if (e.shiftKey && e.key === 'ArrowRight') {
      e.preventDefault();
      onPrev && onPrev();
      return;
    }

    // 朗读当前单词
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      speak();
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

  // 重置整个练习
  const resetExercise = () => {
    const newWords = initializeWords();
    setWords(newWords);
    setCurrentWordIndex(0);
    setInputValue('');
    hasErrorRef.current = false;
    setShowAnswerTip(false);
    setIsAllCorrect(false);
  };

  // 跳转到第一个未完成的单词
  const jumpToFirstIncomplete = () => {
    const firstIncompleteIndex = words.findIndex(
      word => !word.completed && isWord(word.text)
    );
    if (
      firstIncompleteIndex !== -1 &&
      firstIncompleteIndex !== currentWordIndex
    ) {
      setCurrentWordIndex(firstIncompleteIndex);

      setWords(prevWords =>
        prevWords.map((word, index) => ({
          ...word,
          isActive: index === firstIncompleteIndex
        }))
      );

      setInputValue(words[firstIncompleteIndex]?.userInput || '');
      hasErrorRef.current = false;
    }
  };

  // 跳转到最后一个未完成的单词
  const jumpToLastIncomplete = () => {
    const incompleteIndices = words
      .map((word, index) => ({ word, index }))
      .filter(({ word }) => !word.completed && isWord(word.text))
      .map(({ index }) => index);

    const lastIncompleteIndex = incompleteIndices[incompleteIndices.length - 1];
    if (
      lastIncompleteIndex !== undefined &&
      lastIncompleteIndex !== currentWordIndex
    ) {
      setCurrentWordIndex(lastIncompleteIndex);

      setWords(prevWords =>
        prevWords.map((word, index) => ({
          ...word,
          isActive: index === lastIncompleteIndex
        }))
      );

      setInputValue(words[lastIncompleteIndex]?.userInput || '');
      hasErrorRef.current = false;
    }
  };

  // 清除当前输入和错误状态
  const clearCurrentInput = () => {
    setInputValue('');
    hasErrorRef.current = false;

    setWords(prevWords =>
      prevWords.map((word, index) =>
        index === currentWordIndex
          ? { ...word, userInput: '', incorrect: false, completed: false }
          : word
      )
    );
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
    <div className='w-full h-full flex flex-col items-center justify-center text-white relative z-50 overflow-hidden'>
      {isAllCorrect ? (
        <div className='flex flex-col items-center justify-center gap-8 text-center'>
          {/* 完成的句子显示 */}
          <div className='text-6xl font-bold text-white mb-4'>
            {word?.word || ''}
          </div>

          {/* 音标显示 */}
          {(word?.usPhonetic || word?.ukPhonetic) && (
            <div className='text-2xl text-gray-400 mb-4'>
              /{word?.usPhonetic || word?.ukPhonetic}/
            </div>
          )}

          {/* 中文翻译 */}
          <div className='text-3xl text-gray-300'>{word?.meaning || ''}</div>
        </div>
      ) : (
        <>
          <div className='flex flex-col justify-center items-center gap-y-8'>
            {/* 翻译 */}
            <div className='text-md text-center mb-4'>
              {word?.meaning || ''}
            </div>

            {/* 单词显示区域 */}
            <div className='text-center'>
              <div className='relative flex flex-wrap justify-center gap-2 transition-all'>
                {words.map((word, index) =>
                  isWord(word.text) ? (
                    <div
                      key={index}
                      className={`h-16 rounded-sm border-b-2 border-solid text-5xl leading-none transition-all ${getWordsClassNames(
                        word
                      )}
                  `}
                      style={{ minWidth: `${getWordWidth(word.text)}ch` }}>
                      <span
                        className={
                          word.incorrect ? 'text-red-500' : 'text-white'
                        }>
                        {word.userInput}
                      </span>
                      {showAnswerTip &&
                        word.userInput.length < word.text.length && (
                          <span className='text-gray-400 opacity-50'>
                            {word.text.slice(word.userInput.length)}
                          </span>
                        )}
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
        </>
      )}

      {/* 快捷键提示 */}
      <div className='mt-4 flex items-center justify-between bottom-10 absolute w-full select-none px-8'>
        <div
          className='flex items-center text-white/70 pl-20 cursor-pointer'
          onClick={onPrev}>
          <Tooltip title='Shift + ←' color='purple'>
            <LeftOutlined className='text-3xl' />
          </Tooltip>
        </div>
        <div className='flex items-center justify-center space-x-6 text-sm text-white/70'>
          {[
            { keys: ['Ctrl', 'R'], label: '重置练习' },
            { keys: ['Ctrl', 'P'], label: '发音' },
            { keys: ['Ctrl', 'H'], label: '提示' },
            { keys: ['Space  | Enter'], label: '提交' }
          ].map((shortcut, index) => (
            <div key={index} className='flex items-center space-x-1'>
              {shortcut.keys.map((key, keyIndex) => (
                <React.Fragment key={keyIndex}>
                  {keyIndex > 0 && (
                    <span className='text-xs text-fuchsia-300'>+</span>
                  )}
                  <kbd className='px-2 py-1 bg-fuchsia-500/20 border border-fuchsia-400/30 rounded text-xs font-mono text-fuchsia-300'>
                    {key}
                  </kbd>
                </React.Fragment>
              ))}
              <span className='ml-1 font-bold'>{shortcut.label}</span>
            </div>
          ))}
        </div>
        <div
          className='flex items-center text-white/70 pr-20 cursor-pointer'
          onClick={onNext}>
          <Tooltip title='Shift + →' color='purple'>
            <RightOutlined className='text-3xl' />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default TypingText;
