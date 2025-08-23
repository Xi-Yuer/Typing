'use client';
import React from 'react';
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
  const {
    words,
    inputValue,
    isAllCorrect,
    showAnswerTip,
    inputRef,
    handleInputChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    preventCursorMove
  } = useTypingLogic({ word, onComplete, onNext, onPrev });

  return (
    <div className='w-full h-full flex flex-col items-center justify-center text-white relative z-50 overflow-hidden'>
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
