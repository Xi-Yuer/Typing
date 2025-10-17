import React from 'react';
import RotatingText from '@/blocks/RotatingText/RotatingText';

export function Welcome() {
  return (
    <div className='h-screen relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-white'>
      <h2 className='text-4xl inline-block mx-4'>欢迎加入 拼写鸭 </h2>
      <RotatingText
        texts={[
          '拼写鸭',
          '让你上瘾的英语学习App',
          '游戏化闯关，快速掌握核心词汇',
          '告别枯燥死记硬背，高效提升的乐趣！'
        ]}
        mainClassName='px-2 text-4xl sm:px-2 md:px-3 bg-orange-600 text-white font-bold overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg'
        staggerFrom={'last'}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-120%' }}
        staggerDuration={0.025}
        splitLevelClassName='overflow-hidden pb-0.5 sm:pb-1 md:pb-1'
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        rotationInterval={3000}
      />
    </div>
  );
}
