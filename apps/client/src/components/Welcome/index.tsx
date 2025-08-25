import React from 'react';
import RotatingText from '@/blocks/RotatingText/RotatingText';

export function Welcome() {
  return (
    <div className='h-screen relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-white'>
      <h2 className='text-4xl inline-block mx-4'>欢迎加入 Typing Club</h2>
      <RotatingText
        texts={['React', 'Bits', 'Is', 'Cool!']}
        mainClassName='px-2 text-4xl sm:px-2 md:px-3 bg-[#4c29f5] text-white font-bold overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg'
        staggerFrom={'last'}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-120%' }}
        staggerDuration={0.025}
        splitLevelClassName='overflow-hidden pb-0.5 sm:pb-1 md:pb-1'
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        rotationInterval={2000}
      />
    </div>
  );
}
