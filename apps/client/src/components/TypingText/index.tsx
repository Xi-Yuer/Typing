'use client';
import React, { useCallback, useEffect, useRef } from 'react';
import { TypingTextProps } from './types';
import { useTypingLogic } from './hooks/useTypingLogic';
import { WordDisplay } from './components/WordDisplay';
import { CompletionDisplay } from './components/CompletionDisplay';
import { ShortcutHints } from './components/ShortcutHints';
import { Word } from '@/request/globals';

// 导出类型供外部使用
export type { WordState, TypingTextProps } from './types';

const TypingText = function ({
  word,
  mode,
  userSettings,
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
    isFocused,
    setIsFocused,
    handleInputChange,
    handleKeyDown,
    handleGlobalKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    preventCursorMove,
    onResetExercise,
    playWordPronunciation,
    onToggleHint,
    submitAnswer
  } = useTypingLogic({ mode, word, userSettings, onComplete, onNext, onPrev });

  // 确保容器可以接收键盘事件
  useEffect(() => {
    if (containerRef.current && isAllCorrect) {
      containerRef.current.focus();
    }
  }, [isAllCorrect]);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  function showMean(word?: Word) {
    // 翻译模式下，显示单词
    if (mode === 'translation') {
      return word?.word;
    }
    if (!word) {
      return '';
    }
    if (word.meaning?.length > 50) {
      return word.meaningShort;
    } else {
      return word.meaning;
    }
  }

  return (
    <div
      ref={containerRef}
      className='min-h-[500px] flex flex-col items-center justify-center text-white relative z-50 overflow-hidden outline-none'
      onKeyDown={handleGlobalKeyDown}
      tabIndex={0}>
      {isAllCorrect ? (
        <CompletionDisplay word={word} />
      ) : (
        <>
          <div className='flex flex-col justify-center items-center gap-y-8 h-64'>
            {/* 根据不同模式显示不同内容 */}
            {['dictation', 'translation', 'silentTranslation'].includes(
              mode as string
            ) && <div className='text-3xl'>{showMean(word)}</div>}

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
              isFocused={isFocused}
              inputRef={inputRef}
              setIsFocused={setIsFocused}
            />
          </div>
        </>
      )}

      {/* 快捷键提示 */}
      <ShortcutHints
        focusInput={focusInput}
        onPrev={onPrev}
        onNext={onNext}
        onResetExercise={onResetExercise}
        playWordPronunciation={playWordPronunciation}
        onToggleHint={onToggleHint}
        submitAnswer={submitAnswer}
        userSettings={userSettings}
      />
    </div>
  );
};

export default TypingText;
