'use client';
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className='bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center'>
      <div className='text-center space-y-4 max-w-md mx-auto p-8'>
        <div className='w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto'>
          <AlertTriangle className='w-8 h-8 text-red-400' />
        </div>
        <div className='text-xl text-red-400 font-semibold'>数据加载失败</div>
        <div className='text-gray-400'>{error}</div>
      </div>
    </div>
  );
}
