import React from 'react';
import { Word } from '@/request/globals';

interface CompletionDisplayProps {
  word?: Word;
}

export const CompletionDisplay: React.FC<CompletionDisplayProps> = ({
  word
}) => {
  return (
    <div className='flex flex-col items-center justify-center gap-8 text-center h-64'>
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
  );
};
