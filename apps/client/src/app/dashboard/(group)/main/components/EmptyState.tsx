'use client';
import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className=' flex items-center justify-center'>
      <div className='text-center space-y-4 max-w-md mx-auto p-8'>
        <div className='w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto'>
          <BarChart3 className='w-8 h-8 text-gray-400' />
        </div>
        <div className='text-xl text-gray-300 font-semibold'>暂无学习数据</div>
        <div className='text-gray-500'>开始练习后，这里将显示您的学习统计</div>
      </div>
    </div>
  );
}
