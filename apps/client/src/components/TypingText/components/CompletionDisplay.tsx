import React from 'react';
import { Word } from '@/request/globals';

interface CompletionDisplayProps {
  word?: Word;
}

export const CompletionDisplay: React.FC<CompletionDisplayProps> = ({
  word
}) => {
  return (
    <div className='flex flex-col items-center justify-center text-center h-64'>
      {/* 完成的句子显示 */}
      <div className='text-6xl font-bold text-white'>{word?.word || ''}</div>

      {/* 音标显示 */}
      {(word?.usPhonetic || word?.ukPhonetic) && (
        <div className='text-2xl text-gray-400 mb-8'>
          /{word?.usPhonetic || word?.ukPhonetic}/
        </div>
      )}

      {/* 中文翻译 */}
      <div className={'text-3xl text-gray-300 mt-4'}>
        {word?.meaningShort || word?.meaning || ''}
      </div>

      {/* 例句显示 */}
      {word?.example && (
        <div className='mt-6 max-w-xl mx-auto'>
          <div className='text-base text-gray-400 italic leading-relaxed'>
            例句：
            {word.example.split('|').map((sentence, index) => (
              <span key={index}>
                "{sentence.trim()}"
                {index < word.example.split('|').length - 1 && (
                  <span className='text-gray-600 mx-3'>|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
