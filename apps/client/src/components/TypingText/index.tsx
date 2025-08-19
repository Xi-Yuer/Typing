'use client';
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';

interface WordPair {
  word: string;
  mean: string;
}

interface TypingTextProps {
  wordPair?: WordPair;
  className?: string;
  onComplete?: (isCorrect: boolean) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

interface WordState {
  id: number;
  text: string;
  userInput: string;
  isActive: boolean;
  incorrect: boolean;
  completed: boolean;
}

const TypingText = function ({
  wordPair: propWordPair,
  onComplete,
  onNext,
  onPrev
}: TypingTextProps) {
  const wordPair = propWordPair || {
    word: "I don't like to do , it now",
    mean: '我不喜欢现在做'
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const [showAnswerTip, setShowAnswerTip] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

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
                userInput: word.text,
                incorrect: false
              }
            : word
        )
      );

      // 检查是否所有单词都已完成
      const allCompleted = words.every(
        (word, index) => index === currentWordIndex || word.completed
      );

      if (allCompleted) {
        // 所有单词完成
        playSuccessSound();
        setInputValue('');
        onComplete?.(true);
        setIsAllCorrect(true);
      } else {
        // 寻找下一个未完成的单词
        let nextIndex = -1;
        for (let i = currentWordIndex + 1; i < words.length; i++) {
          if (!words[i].completed) {
            nextIndex = i;
            break;
          }
        }

        // 如果右边没有未完成的单词，从左边找
        if (nextIndex === -1) {
          for (let i = 0; i < currentWordIndex; i++) {
            if (!words[i].completed) {
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
      return;
    }

    // Ctrl + N: 跳过当前单词
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      skipCurrentWord();
      return;
    }

    // Ctrl + A: 自动填充当前单词
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      autoFillCurrentWord();
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

    // 左右键切换单词，不播放打字音效
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();

      if (e.key === 'ArrowLeft' && currentWordIndex > 0) {
        // 切换到上一个单词
        const prevIndex = currentWordIndex - 1;
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
        setHasError(false);
      } else if (
        e.key === 'ArrowRight' &&
        currentWordIndex < words.length - 1
      ) {
        // 切换到下一个单词
        const nextIndex = currentWordIndex + 1;
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
        setHasError(false);
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
        setHasError(false);
        return;
      }
    }

    // 其他按键播放打字音效
    playTypingSound();

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

  // 重置整个练习
  const resetExercise = () => {
    const newWords = initializeWords();
    setWords(newWords);
    setCurrentWordIndex(0);
    setInputValue('');
    setHasError(false);
    setShowAnswerTip(false);
    setIsAllCorrect(false);
  };

  // 跳过当前单词
  const skipCurrentWord = () => {
    // 寻找下一个未完成的单词
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

    // 标记当前单词为跳过状态并移动到下一个单词
    if (nextIndex !== -1) {
      setWords(prevWords =>
        prevWords.map((word, index) => {
          if (index === currentWordIndex) {
            return {
              ...word,
              userInput: '[跳过]',
              completed: true,
              isActive: false
            };
          } else if (index === nextIndex) {
            return { ...word, isActive: true };
          }
          return word;
        })
      );

      setCurrentWordIndex(nextIndex);
      setInputValue(words[nextIndex]?.userInput || '');
      setHasError(false);
    }
  };

  // 自动填充当前单词
  const autoFillCurrentWord = () => {
    const currentWord = words[currentWordIndex];
    if (currentWord && !currentWord.completed && isWord(currentWord.text)) {
      setInputValue(currentWord.text);

      setWords(prevWords =>
        prevWords.map((word, index) =>
          index === currentWordIndex
            ? { ...word, userInput: word.text, completed: true }
            : word
        )
      );

      setHasError(false);

      // 自动跳转到下一个单词
      setTimeout(() => {
        // 寻找下一个未完成的单词
        let nextIndex = -1;
        for (let i = currentWordIndex + 1; i < words.length; i++) {
          if (!words[i].completed && isWord(words[i].text)) {
            nextIndex = i;
            break;
          }
        }

        if (nextIndex !== -1) {
          setCurrentWordIndex(nextIndex);

          setWords(prevWords =>
            prevWords.map((word, index) => ({
              ...word,
              isActive: index === nextIndex
            }))
          );

          setInputValue(words[nextIndex]?.userInput || '');
        }
      }, 100);
    }
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
      setHasError(false);
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
      setHasError(false);
    }
  };

  // 清除当前输入和错误状态
  const clearCurrentInput = () => {
    setInputValue('');
    setHasError(false);

    setWords(prevWords =>
      prevWords.map((word, index) =>
        index === currentWordIndex
          ? { ...word, userInput: '', incorrect: false, completed: false }
          : word
      )
    );
  };

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
    <div className='w-full h-full flex flex-col items-center justify-center text-white relative z-50 overflow-hidden'>
      {isAllCorrect ? (
        <></>
      ) : (
        <>
          <div className='flex flex-col justify-center items-center gap-y-8'>
            {/* 中文翻译 */}
            <div className='text-5xl text-center mb-4'>{wordPair.mean}</div>

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
        <div className='flex items-center text-white/70 pl-20'>
          <span className='text-xs text-fuchsia-300'>←</span>
        </div>
        <div className='flex items-center justify-center space-x-6 text-sm text-white/70'>
          {[
            { keys: ['Ctrl', 'R'], label: '重置练习' },
            { keys: ['Ctrl', 'P'], label: '发音' },
            { keys: ['Ctrl', 'H'], label: '切换提示' },
            { keys: ['Enter | Space'], label: '提交' }
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
        <div className='flex items-center text-white/70 pr-20'>
          <span className='text-xs text-fuchsia-300'>→</span>
        </div>
      </div>
    </div>
  );
};

export default TypingText;

export type { WordPair, TypingTextProps };
