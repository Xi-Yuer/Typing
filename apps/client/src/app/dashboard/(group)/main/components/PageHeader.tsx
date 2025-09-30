'use client';
import React from 'react';
import { Activity } from 'lucide-react';

export default function PageHeader() {
  return (
    <div className='relative overflow-hidden mb-4'>
      <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20'></div>
      <div className='relative px-8 py-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center space-y-4'>
            <div className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20'>
              <Activity className='w-5 h-5 text-purple-400' />
              <span className='text-sm font-medium text-gray-200'>
                学习分析报告
              </span>
            </div>
            <p className='text-lg text-gray-400 max-w-2xl mx-auto'>
              深入了解您的学习模式，发现改进空间
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
