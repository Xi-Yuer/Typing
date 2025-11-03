'use client';
import React from 'react';
import { AlertTriangle, Target, Award, Zap } from 'lucide-react';

interface MetricsCardsProps {
  totalErrors: number;
  totalLanguages: number;
  totalCategories: number;
  avgErrorsPerLanguage: string;
}

export default function MetricsCards({
  totalErrors,
  totalLanguages,
  totalCategories,
  avgErrorsPerLanguage
}: MetricsCardsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
      <div className='group relative overflow-hidden bg-orange-500/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/10 hover:border-orange-400/20 hover:bg-orange-500/8 transition-all duration-300 hover:scale-[1.02]'>
        <div className='absolute top-4 right-4'>
          <AlertTriangle className='w-6 h-6 text-orange-500' />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-orange-400'>总错误次数</div>
          <div className='text-3xl font-bold text-white'>
            {totalErrors.toLocaleString()}
          </div>
          <div className='text-xs text-orange-400'>需要重点关注的错误</div>
        </div>
      </div>

      <div className='group relative overflow-hidden bg-orange-400/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/10 hover:border-orange-300/20 hover:bg-orange-400/8 transition-all duration-300 hover:scale-[1.02]'>
        <div className='absolute top-4 right-4'>
          <Target className='w-6 h-6 text-orange-500' />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-orange-400'>涉及语言</div>
          <div className='text-3xl font-bold text-white'>{totalLanguages}</div>
          <div className='text-xs text-orange-400'>种语言类型</div>
        </div>
      </div>

      <div className='group relative overflow-hidden bg-orange-500/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/10 hover:border-orange-400/20 hover:bg-orange-500/8 transition-all duration-300 hover:scale-[1.02]'>
        <div className='absolute top-4 right-4'>
          <Award className='w-6 h-6 text-orange-500' />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-orange-400'>涉及分类</div>
          <div className='text-3xl font-bold text-white'>{totalCategories}</div>
          <div className='text-xs text-orange-400'>个知识领域</div>
        </div>
      </div>

      <div className='group relative overflow-hidden bg-orange-600/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-600/10 hover:border-orange-500/20 hover:bg-orange-600/8 transition-all duration-300 hover:scale-[1.02]'>
        <div className='absolute top-4 right-4'>
          <Zap className='w-6 h-6 text-orange-500' />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-orange-400'>平均错误率</div>
          <div className='text-3xl font-bold text-white'>
            {avgErrorsPerLanguage}
          </div>
          <div className='text-xs text-orange-500'>每语言平均</div>
        </div>
      </div>
    </div>
  );
}
