'use client';
import React from 'react';
import { PieChart } from '@/components/Charts';
import {
  TrendingUp,
  AlertTriangle,
  Target,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { WordErrorStatisticsDto } from '@/request/globals';

interface OverviewTabProps {
  statistics: WordErrorStatisticsDto;
  topLanguage: any;
  topCategory: any;
  totalLanguages: number;
  totalCategories: number;
  languageChartData: any[];
  categoryChartData: any[];
}

export default function OverviewTab({
  statistics,
  topLanguage,
  topCategory,
  totalLanguages,
  totalCategories,
  languageChartData,
  categoryChartData
}: OverviewTabProps) {
  return (
    <div className='space-y-8'>
      {/* 关键洞察 */}
      <div className='bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm'>
        <div className='flex items-center space-x-3 mb-6'>
          <div className='w-10 h-10 bg-gradient-to-r rounded-xl flex items-center justify-center'>
            <TrendingUp className='w-5 h-5 text-white' />
          </div>
          <h2 className='text-2xl font-bold text-white'>关键洞察</h2>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <div className='bg-gradient-to-r from-red-500/10 to-red-600/20 rounded-xl p-6 border border-red-500/30'>
              <div className='flex items-center space-x-3 mb-3'>
                <AlertTriangle className='w-6 h-6 text-red-400' />
                <h3 className='text-lg font-semibold text-red-300'>
                  最需要关注的领域
                </h3>
              </div>
              <div className='space-y-2'>
                <div className='text-sm text-gray-400'>
                  语言:{' '}
                  <span className='text-white font-medium'>
                    {topLanguage?.languageName || ''}
                  </span>
                </div>
                <div className='text-sm text-gray-400'>
                  分类:{' '}
                  <span className='text-white font-medium'>
                    {topCategory?.categoryName || ''}
                  </span>
                </div>
                <div className='text-xs text-red-400/80'>
                  建议重点练习这些领域
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='bg-gradient-to-r from-blue-500/10 to-blue-600/20 rounded-xl p-6 border border-blue-500/30'>
              <div className='flex items-center space-x-3 mb-3'>
                <Target className='w-6 h-6 text-blue-400' />
                <h3 className='text-lg font-semibold text-blue-300'>
                  学习分布
                </h3>
              </div>
              <div className='space-y-2'>
                <div className='text-sm text-gray-400'>
                  语言覆盖:{' '}
                  <span className='text-white font-medium'>
                    {totalLanguages} 种
                  </span>
                </div>
                <div className='text-sm text-gray-400'>
                  知识领域:{' '}
                  <span className='text-white font-medium'>
                    {totalCategories} 个
                  </span>
                </div>
                <div className='text-xs text-blue-400/80'>
                  学习范围广泛，需要均衡发展
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数据可视化 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm'>
          <div className='flex items-center space-x-3 mb-6'>
            <div className='w-10 h-10 bg-gradient-to-r rounded-xl flex items-center justify-center'>
              <PieChartIcon className='w-5 h-5 text-white' />
            </div>
            <h3 className='text-xl font-bold text-white'>语言分布</h3>
          </div>
          <div className='h-80'>
            <PieChart data={languageChartData} height={320} />
          </div>
        </div>

        <div className='bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm'>
          <div className='flex items-center space-x-3 mb-6'>
            <div className='w-10 h-10 bg-gradient-to-r rounded-xl flex items-center justify-center'>
              <BarChart3 className='w-5 h-5 text-white' />
            </div>
            <h3 className='text-xl font-bold text-white'>分类分布</h3>
          </div>
          <div className='h-80'>
            <PieChart data={categoryChartData} height={320} />
          </div>
        </div>
      </div>
    </div>
  );
}
