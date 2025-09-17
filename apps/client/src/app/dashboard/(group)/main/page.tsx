'use client';
import { getWordErrorStatistics } from '@/api';
import { WordErrorStatisticsDto } from '@/request/globals';
import { useEffect, useState } from 'react';

export default function Main() {
  const [statistics, setStatistics] = useState<WordErrorStatisticsDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = (await getWordErrorStatistics()) as any;
        if (response && response.code === 200) {
          setStatistics(response.data);
        } else {
          setError(response?.message || '获取统计数据失败');
        }
      } catch (err) {
        setError('网络请求失败');
        console.error('获取错词统计数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-white'>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-purple-400 text-lg'>错误: {error}</div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-white'>暂无数据</div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      {/* 总体统计卡片 */}
      <div className='bg-slate-800/50 rounded-lg shadow-lg border border-slate-700/50 backdrop-blur-sm p-6'>
        <h2 className='text-xl font-semibold text-white mb-4'>总体统计</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-lg p-4 text-center border border-purple-500/30'>
            <div className='text-3xl font-bold text-purple-300'>
              {statistics.totalErrors}
            </div>
            <div className='text-sm text-gray-300'>总错误次数</div>
          </div>
          <div className='bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg p-4 text-center border border-blue-500/30'>
            <div className='text-3xl font-bold text-blue-300'>
              {statistics.categoryStats.length}
            </div>
            <div className='text-sm text-gray-300'>涉及分类数</div>
          </div>
          <div className='bg-gradient-to-br from-indigo-500/20 to-indigo-600/30 rounded-lg p-4 text-center border border-indigo-500/30'>
            <div className='text-3xl font-bold text-indigo-300'>
              {statistics.languageStats.length}
            </div>
            <div className='text-sm text-gray-300'>涉及语言数</div>
          </div>
        </div>
      </div>

      {/* 语言统计表格 */}
      <div className='bg-slate-800/50 rounded-lg shadow-lg border border-slate-700/50 backdrop-blur-sm p-6'>
        <h2 className='text-xl font-semibold text-white mb-4'>语言统计</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-slate-600'>
            <thead className='bg-slate-700/50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                  语言名称
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                  错误次数
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                  错误单词数
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                  平均错误率
                </th>
              </tr>
            </thead>
            <tbody className='bg-slate-800/30 divide-y divide-slate-600'>
              {statistics.languageStats.map(language => (
                <tr
                  key={language.languageId}
                  className='hover:bg-slate-700/30 transition-colors duration-200'
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>
                    {language.languageName}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-200'>
                    {language.errorCount}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-200'>
                    {language.wordCount}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-200'>
                    {language.wordCount > 0
                      ? (language.errorCount / language.wordCount).toFixed(2)
                      : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分类统计表格 */}
      <div className='bg-slate-800/50 rounded-lg shadow-lg border border-slate-700/50 backdrop-blur-sm p-6'>
        <h2 className='text-xl font-semibold text-white mb-4'>分类统计</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-slate-600'>
            <thead className='bg-slate-700/50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                  分类名称
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                  错误次数
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                  错误单词数
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                  平均错误率
                </th>
              </tr>
            </thead>
            <tbody className='bg-slate-800/30 divide-y divide-slate-600'>
              {statistics.categoryStats.map(category => (
                <tr
                  key={category.categoryId}
                  className='hover:bg-slate-700/30 transition-colors duration-200'
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>
                    {category.categoryName}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-200'>
                    {category.errorCount}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-200'>
                    {category.wordCount}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-200'>
                    {category.wordCount > 0
                      ? (category.errorCount / category.wordCount).toFixed(2)
                      : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
