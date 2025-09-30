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
      <div className='group relative overflow-hidden bg-gradient-to-br from-red-500/10 to-red-600/20 rounded-2xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-105'>
        <div className='absolute top-4 right-4'>
          <AlertTriangle className='w-8 h-8 text-red-400/60' />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-red-300'>总错误次数</div>
          <div className='text-3xl font-bold text-white'>
            {totalErrors.toLocaleString()}
          </div>
          <div className='text-xs text-red-400/80'>需要重点关注的错误</div>
        </div>
      </div>

      <div className='group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105'>
        <div className='absolute top-4 right-4'>
          <Target className='w-8 h-8 text-blue-400/60' />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-blue-300'>涉及语言</div>
          <div className='text-3xl font-bold text-white'>{totalLanguages}</div>
          <div className='text-xs text-blue-400/80'>种语言类型</div>
        </div>
      </div>

      <div className='group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105'>
        <div className='absolute top-4 right-4'>
          <Award className='w-8 h-8 text-purple-400/60' />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-purple-300'>涉及分类</div>
          <div className='text-3xl font-bold text-white'>{totalCategories}</div>
          <div className='text-xs text-purple-400/80'>个知识领域</div>
        </div>
      </div>

      <div className='group relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105'>
        <div className='absolute top-4 right-4'>
          <Zap className='w-8 h-8 text-emerald-400/60' />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-emerald-300'>平均错误率</div>
          <div className='text-3xl font-bold text-white'>
            {avgErrorsPerLanguage}
          </div>
          <div className='text-xs text-emerald-400/80'>每语言平均</div>
        </div>
      </div>
    </div>
  );
}
