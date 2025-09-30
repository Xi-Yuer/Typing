'use client';
import React from 'react';

export default function LoadingState() {
  return (
    <div className='bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <div className='w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto'></div>
        <div className='text-lg text-gray-300 font-medium'>
          正在分析您的学习数据...
        </div>
      </div>
    </div>
  );
}
