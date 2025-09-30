'use client';
import React from 'react';
import { BarChart } from '@/components/Charts';
import { Activity, Award } from 'lucide-react';
import { WordErrorStatisticsDto } from '@/request/globals';

interface CategoryTabProps {
  statistics: WordErrorStatisticsDto;
  topCategory: any;
  categoryChartData: any[];
}

export default function CategoryTab({
  statistics,
  topCategory,
  categoryChartData
}: CategoryTabProps) {
  return (
    <div className='space-y-8'>
      <div className='bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm'>
        <div className='flex items-center space-x-3 mb-8'>
          <div className='w-10 h-10 bg-gradient-to-r rounded-xl flex items-center justify-center'>
            <Activity className='w-5 h-5 text-white' />
          </div>
          <h2 className='text-2xl font-bold text-white'>分类错误分析</h2>
        </div>

        <div className='mb-8'>
          <BarChart
            data={categoryChartData}
            title='各分类错误次数对比'
            height={400}
            yAxisName='错误次数'
            showDataLabel={true}
          />
        </div>

        <div className='bg-slate-900/30 rounded-xl p-6 border border-slate-600/30'>
          <h3 className='text-lg font-semibold text-white mb-6'>详细数据表</h3>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-slate-600'>
                  <th className='text-left py-3 px-4 text-sm font-medium text-gray-300'>
                    分类
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-gray-300'>
                    错误次数
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-gray-300'>
                    单词数
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-gray-300'>
                    错误率
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-gray-300'>
                    状态
                  </th>
                </tr>
              </thead>
              <tbody>
                {statistics?.categoryStats?.map(category => {
                  const errorRate =
                    category.wordCount > 0
                      ? category.errorCount / category.wordCount
                      : 0;
                  const isTopError =
                    category.errorCount === topCategory?.errorCount;
                  return (
                    <tr
                      key={category.categoryId}
                      className='border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors'>
                      <td className='py-4 px-4'>
                        <div className='flex items-center space-x-3'>
                          {isTopError && (
                            <Award className='w-4 h-4 text-yellow-400' />
                          )}
                          <span className='font-medium text-white'>
                            {category?.categoryName || ''}
                          </span>
                        </div>
                      </td>
                      <td className='py-4 px-4 text-gray-200'>
                        {category?.errorCount.toLocaleString() || '0'}
                      </td>
                      <td className='py-4 px-4 text-gray-200'>
                        {category?.wordCount.toLocaleString() || '0'}
                      </td>
                      <td className='py-4 px-4'>
                        <div className='flex items-center space-x-2'>
                          <div className='text-gray-200'>
                            {(errorRate * 100).toFixed(1) || '0.0'}%
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${errorRate > 0.1 ? 'bg-red-400' : errorRate > 0.05 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                        </div>
                      </td>
                      <td className='py-4 px-4'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            errorRate > 0.1
                              ? 'bg-red-500/20 text-red-300'
                              : errorRate > 0.05
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-green-500/20 text-green-300'
                          }`}>
                          {errorRate > 0.1
                            ? '需关注'
                            : errorRate > 0.05
                              ? '一般'
                              : '良好'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
