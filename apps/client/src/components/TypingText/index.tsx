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
  mode,
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
  } = useTypingLogic({ mode, word, onComplete, onNext, onPrev });

  // 确保容器可以接收键盘事件
  useEffect(() => {
    if (containerRef.current && isAllCorrect) {
      containerRef.current.focus();
    }
  }, [isAllCorrect]);

  return (
    <div
      ref={containerRef}
      className='min-h-[500px] flex flex-col items-center justify-center text-white relative z-50 overflow-hidden outline-none'
      onKeyDown={handleGlobalKeyDown}
      tabIndex={0}
    >
      {isAllCorrect ? (
        <CompletionDisplay word={word} />
      ) : (
        <>
          <div className='flex flex-col justify-center items-center gap-y-8'>
            {/* 根据不同模式显示不同内容 */}
            {mode === 'dictation' && (
              // 听写模式：显示母语提示
              <div
                className={
                  (word?.meaning?.length || 0) > 50 ? 'text-md' : 'text-3xl'
                }
              >
                {word?.meaning}
              </div>
            )}

            {mode === 'translation' && (
              // 翻译模式：显示外语内容
              <div
                className={
                  (word?.word?.length || 0) > 20 ? 'text-md' : 'text-3xl'
                }
              >
                {word?.word}
              </div>
            )}

            {mode === 'silentTranslation' && (
              // 静默翻译模式：显示母语提示
              <div
                className={
                  (word?.meaning?.length || 0) > 50 ? 'text-md' : 'text-3xl'
                }
              >
                {word?.meaning}
              </div>
            )}

            {/* 音频默写模式不显示任何提示文字 */}

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
