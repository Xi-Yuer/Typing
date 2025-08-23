'use client';
import React, { useEffect, useRef } from 'react';
import { TypingTextProps } from './types';
import { useTypingLogic } from './hooks/useTypingLogic';
import { WordDisplay } from './components/WordDisplay';
import { CompletionDisplay } from './components/CompletionDisplay';
import { ShortcutHints } from './components/ShortcutHints';

// 导出类型供外部使用
export type { WordState, TypingTextProps } from './types';

const TypingText = function ({
  word,
  onComplete,
  onNext,
  onPrev
}: TypingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    words,
    inputValue,
    isAllCorrect,
    showAnswerTip,
    inputRef,
    handleInputChange,
    handleKeyDown,
    handleGlobalKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    preventCursorMove
  } = useTypingLogic({ word, onComplete, onNext, onPrev });

  // 确保容器可以接收键盘事件
  useEffect(() => {
    if (containerRef.current && isAllCorrect) {
      containerRef.current.focus();
    }
  }, [isAllCorrect]);

  return (
    <div
      ref={containerRef}
      className='w-full h-full flex flex-col items-center justify-center text-white relative z-50 overflow-hidden outline-none'
      onKeyDown={handleGlobalKeyDown}
      tabIndex={0}
    >
      {isAllCorrect ? (
        <CompletionDisplay word={word} />
      ) : (
        <>
          <div className='flex flex-col justify-center items-center gap-y-8'>
            {/* 翻译 */}
            <div className='text-md text-center mb-4'>
              {word?.meaning || ''}
            </div>

            {/* 单词显示区域 */}
            <WordDisplay
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              onMouseDown={preventCursorMove}
              words={words}
              inputValue={inputValue}
              showAnswerTip={showAnswerTip}
              inputRef={inputRef}
            />
          </div>
        </>
      )}

      {/* 快捷键提示 */}
      <ShortcutHints onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default TypingText;
