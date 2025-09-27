'use client';
import { getWordErrorStatistics } from '@/api';
import { WordErrorStatisticsDto } from '@/request/globals';
import { useEffect, useState } from 'react';
import { PieChart, BarChart } from '@/components/Charts';
import { Segmented } from 'antd';
import {
  TrendingUp,
  Target,
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Award
} from 'lucide-react';

export default function Main() {
  const [statistics, setStatistics] = useState<WordErrorStatisticsDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'languages' | 'categories'
  >('overview');

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
      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto'></div>
          <div className='text-lg text-gray-300 font-medium'>
            正在分析您的学习数据...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center'>
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

  if (!statistics) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center'>
        <div className='text-center space-y-4 max-w-md mx-auto p-8'>
          <div className='w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto'>
            <BarChart3 className='w-8 h-8 text-gray-400' />
          </div>
          <div className='text-xl text-gray-300 font-semibold'>
            暂无学习数据
          </div>
          <div className='text-gray-500'>
            开始练习后，这里将显示您的学习统计
          </div>
        </div>
      </div>
    );
  }

  // 计算统计数据
  const totalErrors = statistics.totalErrors;
  const totalLanguages = statistics.languageStats.length;
  const totalCategories = statistics.categoryStats.length;
  const avgErrorsPerLanguage =
    totalLanguages > 0 ? (totalErrors / totalLanguages).toFixed(1) : '0';

  // 找出错误最多的语言和分类
  const topLanguage = statistics.languageStats.reduce(
    (max, lang) => (lang.errorCount > max.errorCount ? lang : max),
    statistics.languageStats[0]
  );
  const topCategory = statistics.categoryStats.reduce(
    (max, cat) => (cat.errorCount > max.errorCount ? cat : max),
    statistics.categoryStats[0]
  );

  // 准备图表数据
  const languageChartData = statistics.languageStats.map(lang => ({
    name: lang.languageName,
    value: lang.errorCount
  }));

  const categoryChartData = statistics.categoryStats.map(cat => ({
    name: cat.categoryName,
    value: cat.errorCount
  }));

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      {/* 页面头部 */}
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

      <div className='px-8 pb-12'>
        <div className='max-w-7xl mx-auto'>
          {/* 核心指标卡片 */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
            <div className='group relative overflow-hidden bg-gradient-to-br from-red-500/10 to-red-600/20 rounded-2xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-105'>
              <div className='absolute top-4 right-4'>
                <AlertTriangle className='w-8 h-8 text-red-400/60' />
              </div>
              <div className='space-y-2'>
                <div className='text-sm font-medium text-red-300'>
                  总错误次数
                </div>
                <div className='text-3xl font-bold text-white'>
                  {totalErrors.toLocaleString()}
                </div>
                <div className='text-xs text-red-400/80'>
                  需要重点关注的错误
                </div>
              </div>
            </div>

            <div className='group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105'>
              <div className='absolute top-4 right-4'>
                <Target className='w-8 h-8 text-blue-400/60' />
              </div>
              <div className='space-y-2'>
                <div className='text-sm font-medium text-blue-300'>
                  涉及语言
                </div>
                <div className='text-3xl font-bold text-white'>
                  {totalLanguages}
                </div>
                <div className='text-xs text-blue-400/80'>种语言类型</div>
              </div>
            </div>

            <div className='group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105'>
              <div className='absolute top-4 right-4'>
                <Award className='w-8 h-8 text-purple-400/60' />
              </div>
              <div className='space-y-2'>
                <div className='text-sm font-medium text-purple-300'>
                  涉及分类
                </div>
                <div className='text-3xl font-bold text-white'>
                  {totalCategories}
                </div>
                <div className='text-xs text-purple-400/80'>个知识领域</div>
              </div>
            </div>

            <div className='group relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105'>
              <div className='absolute top-4 right-4'>
                <Zap className='w-8 h-8 text-emerald-400/60' />
              </div>
              <div className='space-y-2'>
                <div className='text-sm font-medium text-emerald-300'>
                  平均错误率
                </div>
                <div className='text-3xl font-bold text-white'>
                  {avgErrorsPerLanguage}
                </div>
                <div className='text-xs text-emerald-400/80'>每语言平均</div>
              </div>
            </div>
          </div>

          {/* 导航标签 */}
          <div className='mb-8'>
            <Segmented
              value={activeTab}
              onChange={value => setActiveTab(value as any)}
              options={[
                {
                  label: (
                    <div className='flex items-center justify-center space-x-2 px-2'>
                      <PieChartIcon className='w-4 h-4' />
                      <span>概览分析</span>
                    </div>
                  ),
                  value: 'overview'
                },
                {
                  label: (
                    <div className='flex items-center justify-center space-x-2 px-2'>
                      <BarChart3 className='w-4 h-4' />
                      <span>语言统计</span>
                    </div>
                  ),
                  value: 'languages'
                },
                {
                  label: (
                    <div className='flex items-center justify-center space-x-2 px-2'>
                      <Activity className='w-4 h-4' />
                      <span>分类统计</span>
                    </div>
                  ),
                  value: 'categories'
                }
              ]}
              size='large'
              block
              className='custom-segmented bg-slate-800/50 border border-slate-600'
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgb(71, 85, 105)',
                borderRadius: '8px',
                padding: '5px',
                textAlign: 'center'
              }}
            />
          </div>

          {/* 标签页内容 */}
          <div className='space-y-8'>
            {/* 概览分析 */}
            {activeTab === 'overview' && (
              <div className='space-y-8'>
                {/* 关键洞察 */}
                <div className='bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm'>
                  <div className='flex items-center space-x-3 mb-6'>
                    <div className='w-10 h-10 bg-gradient-to-r  rounded-xl flex items-center justify-center'>
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
                              {topLanguage.languageName}
                            </span>
                          </div>
                          <div className='text-sm text-gray-400'>
                            分类:{' '}
                            <span className='text-white font-medium'>
                              {topCategory.categoryName}
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
                      <div className='w-10 h-10 bg-gradient-to-r  rounded-xl flex items-center justify-center'>
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
            )}

            {/* 语言统计 */}
            {activeTab === 'languages' && (
              <div className='space-y-8'>
                <div className='bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm'>
                  <div className='flex items-center space-x-3 mb-8'>
                    <div className='w-10 h-10 bg-gradient-to-r  rounded-xl flex items-center justify-center'>
                      <BarChart3 className='w-5 h-5 text-white' />
                    </div>
                    <h2 className='text-2xl font-bold text-white'>
                      语言错误分析
                    </h2>
                  </div>

                  <div className='mb-8'>
                    <BarChart
                      data={languageChartData}
                      title='各语言错误次数对比'
                      height={400}
                      yAxisName='错误次数'
                      showDataLabel={true}
                    />
                  </div>

                  <div className='bg-slate-900/30 rounded-xl p-6 border border-slate-600/30'>
                    <h3 className='text-lg font-semibold text-white mb-6'>
                      详细数据表
                    </h3>
                    <div className='overflow-x-auto'>
                      <table className='w-full'>
                        <thead>
                          <tr className='border-b border-slate-600'>
                            <th className='text-left py-3 px-4 text-sm font-medium text-gray-300'>
                              语言
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
                          {statistics.languageStats.map(language => {
                            const errorRate =
                              language.wordCount > 0
                                ? language.errorCount / language.wordCount
                                : 0;
                            const isTopError =
                              language.errorCount === topLanguage.errorCount;
                            return (
                              <tr
                                key={language.languageId}
                                className='border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors'>
                                <td className='py-4 px-4'>
                                  <div className='flex items-center space-x-3'>
                                    {isTopError && (
                                      <Award className='w-4 h-4 text-yellow-400' />
                                    )}
                                    <span className='font-medium text-white'>
                                      {language.languageName}
                                    </span>
                                  </div>
                                </td>
                                <td className='py-4 px-4 text-gray-200'>
                                  {language.errorCount.toLocaleString()}
                                </td>
                                <td className='py-4 px-4 text-gray-200'>
                                  {language.wordCount.toLocaleString()}
                                </td>
                                <td className='py-4 px-4'>
                                  <div className='flex items-center space-x-2'>
                                    <div className='text-gray-200'>
                                      {(errorRate * 100).toFixed(1)}%
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
            )}

            {/* 分类统计 */}
            {activeTab === 'categories' && (
              <div className='space-y-8'>
                <div className='bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm'>
                  <div className='flex items-center space-x-3 mb-8'>
                    <div className='w-10 h-10 bg-gradient-to-r rounded-xl flex items-center justify-center'>
                      <Activity className='w-5 h-5 text-white' />
                    </div>
                    <h2 className='text-2xl font-bold text-white'>
                      分类错误分析
                    </h2>
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
                    <h3 className='text-lg font-semibold text-white mb-6'>
                      详细数据表
                    </h3>
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
                          {statistics.categoryStats.map(category => {
                            const errorRate =
                              category.wordCount > 0
                                ? category.errorCount / category.wordCount
                                : 0;
                            const isTopError =
                              category.errorCount === topCategory.errorCount;
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
                                      {category.categoryName}
                                    </span>
                                  </div>
                                </td>
                                <td className='py-4 px-4 text-gray-200'>
                                  {category.errorCount.toLocaleString()}
                                </td>
                                <td className='py-4 px-4 text-gray-200'>
                                  {category.wordCount.toLocaleString()}
                                </td>
                                <td className='py-4 px-4'>
                                  <div className='flex items-center space-x-2'>
                                    <div className='text-gray-200'>
                                      {(errorRate * 100).toFixed(1)}%
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
