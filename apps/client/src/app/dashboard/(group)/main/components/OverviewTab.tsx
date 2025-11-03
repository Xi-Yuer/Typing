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
            <div className='bg-orange-500/5 backdrop-blur-sm rounded-xl p-6 border border-orange-500/10 hover:border-orange-400/20 hover:bg-orange-500/8 transition-all duration-300'>
              <div className='flex items-center space-x-3 mb-3'>
                <AlertTriangle className='w-6 h-6 text-orange-400' />
                <h3 className='text-lg font-semibold text-orange-400'>
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
                <div className='text-xs text-orange-400'>
                  建议重点练习这些领域
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='bg-orange-400/5 backdrop-blur-sm rounded-xl p-6 border border-orange-400/10 hover:border-orange-300/20 hover:bg-orange-400/8 transition-all duration-300'>
              <div className='flex items-center space-x-3 mb-3'>
                <Target className='w-6 h-6 text-orange-300' />
                <h3 className='text-lg font-semibold text-orange-400'>
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
                <div className='text-xs text-orange-400'>
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
