import React, { useEffect } from 'react';
import { WordState } from '../types';
import { getWordsClassNames, getWordWidth, isWord } from '@/utils';
import { STYLES } from '../constants';

interface WordDisplayProps {
  words: WordState[];
  showAnswerTip: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({
  words,
  showAnswerTip,
  inputRef,
  inputValue,
  isFocused,
  setIsFocused,
  onInputChange,
  onKeyDown,
  onMouseDown,
  onCompositionStart,
  onCompositionEnd
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, [inputRef, setIsFocused]);
  return (
    <div className='text-center'>
      <div className='relative flex flex-wrap justify-center gap-2 transition-all'>
        {words.map((word, index) =>
          isWord(word.text) ? (
            <div
              key={index}
              className={`${STYLES.WORD_HEIGHT} rounded-sm border-b-2 border-solid ${STYLES.WORD_TEXT_SIZE} leading-none transition-all ${getWordsClassNames(
                word
              )} ${!isFocused ? STYLES.BORDER.BLUR : ''}
            }
              `}
              style={{ minWidth: `${getWordWidth(word.text)}ch` }}>
              <span
                className={
                  word.incorrect ? STYLES.COLORS.ERROR : STYLES.COLORS.NORMAL
                }>
                {word.userInput}
              </span>
              {showAnswerTip && word.userInput.length < word.text.length && (
                <span className={STYLES.COLORS.HINT}>
                  {word.text.slice(word.userInput.length)}
                </span>
              )}
            </div>
          ) : (
            <div
              key={index}
              className={`${STYLES.WORD_HEIGHT} rounded-sm ${STYLES.WORD_TEXT_SIZE} leading-none transition-all ${STYLES.COLORS.NORMAL}`}>
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
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          onMouseDown={onMouseDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          autoFocus
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
        />
      </div>
    </div>
  );
};
