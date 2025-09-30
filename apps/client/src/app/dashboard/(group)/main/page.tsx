'use client';
import { getWordErrorStatistics } from '@/api';
import { WordErrorStatisticsDto } from '@/request/globals';
import { useEffect, useState } from 'react';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import PageHeader from './components/PageHeader';
import MetricsCards from './components/MetricsCards';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/OverviewTab';
import LanguageTab from './components/LanguageTab';
import CategoryTab from './components/CategoryTab';

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
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!statistics) {
    return <EmptyState />;
  }

  // 计算统计数据
  const totalErrors = statistics.totalErrors || 0;
  const totalLanguages = statistics.languageStats?.length || 0;
  const totalCategories = statistics.categoryStats?.length || 0;
  const avgErrorsPerLanguage =
    totalLanguages > 0 ? (totalErrors / totalLanguages).toFixed(1) : '0.0';

  // 找出错误最多的语言和分类
  const topLanguage = statistics.languageStats?.reduce(
    (max, lang) => (lang.errorCount > max.errorCount ? lang : max),
    statistics.languageStats?.[0]
  );
  const topCategory = statistics.categoryStats?.reduce(
    (max, cat) => (cat.errorCount > max.errorCount ? cat : max),
    statistics.categoryStats?.[0]
  );

  // 准备图表数据
  const languageChartData = statistics.languageStats?.map(lang => ({
    name: lang.languageName,
    value: lang.errorCount
  }));

  const categoryChartData = statistics.categoryStats?.map(cat => ({
    name: cat.categoryName,
    value: cat.errorCount
  }));

  return (
    <div className='bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      {/* 页面头部 */}
      <PageHeader />

      <div className='px-8 pb-12'>
        <div className='max-w-7xl mx-auto'>
          {/* 核心指标卡片 */}
          <MetricsCards
            totalErrors={totalErrors}
            totalLanguages={totalLanguages}
            totalCategories={totalCategories}
            avgErrorsPerLanguage={avgErrorsPerLanguage}
          />

          {/* 导航标签 */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* 标签页内容 */}
          <div className='space-y-8'>
            {activeTab === 'overview' && (
              <OverviewTab
                statistics={statistics}
                topLanguage={topLanguage}
                topCategory={topCategory}
                totalLanguages={totalLanguages}
                totalCategories={totalCategories}
                languageChartData={languageChartData}
                categoryChartData={categoryChartData}
              />
            )}

            {activeTab === 'languages' && (
              <LanguageTab
                statistics={statistics}
                topLanguage={topLanguage}
                languageChartData={languageChartData}
              />
            )}

            {activeTab === 'categories' && (
              <CategoryTab
                statistics={statistics}
                topCategory={topCategory}
                categoryChartData={categoryChartData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
