'use client';
import { getWordRanking } from '@/api';
import { RankingResponseDto, RankingItemDto } from '@/request/globals';
import { useEffect, useState } from 'react';
import { Segmented } from 'antd';
import IconFont from '@/components/IconFont';

type RankingType = 'total' | 'daily' | 'weekly';

export default function Rangking() {
  const [ranking, setRanking] = useState<RankingResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<RankingType>('daily');

  const fetchRanking = async (type: RankingType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWordRanking(type, 10);
      setRanking(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking(activeTab);
  }, [activeTab]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <IconFont type='icon-first' size={24} />;
      case 2:
        return <IconFont type='icon-second' size={24} />;
      case 3:
        return <IconFont type='icon-third' size={24} />;
      default:
        return rank;
    }
  };

  const RankingItem = ({ item }: { item: RankingItemDto }) => {
    const isFirst = item.rank === 1;
    const isSecond = item.rank === 2;
    const isThird = item.rank === 3;

    return (
      <div
        className={`flex items-center justify-between p-4 rounded-lg ${isFirst ? 'text-yellow-400' : isSecond ? 'text-gray-400' : isThird ? 'text-[#c18240]' : 'text-purple-400'}`}
      >
        <div className='flex items-center space-x-4'>
          {/* 排名图标 */}
          <div>{getRankIcon(item.rank)}</div>

          {/* 用户信息 */}
          <div className='flex-1 min-w-0'>
            <div className='font-medium truncate'>{item.userName}</div>
            <div className='text-sm text-gray-400 truncate'>
              {item.userEmail || ''}
            </div>
          </div>
        </div>

        {/* 分数 */}
        <div className='text-right'>
          <div className={`text-lg font-semibold flex items-center gap-3`}>
            {item.score || 0}
            <div className='text-sm0'>单词</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      {/* 标签页 */}
      <div className='mb-8'>
        <Segmented
          options={[
            { label: '日榜', value: 'daily' },
            { label: '周榜', value: 'weekly' },
            { label: '总榜', value: 'total' }
          ]}
          value={activeTab}
          onChange={value => setActiveTab(value as RankingType)}
          block
          size='large'
          className='custom-segmented bg-slate-800/50 border border-slate-600'
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgb(71, 85, 105)',
            borderRadius: '8px',
            padding: '5px'
          }}
        />
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500'></div>
          <span className='ml-2 text-gray-300'>加载中...</span>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className='bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6'>
          <div className='text-red-400'>加载失败: {error}</div>
        </div>
      )}

      {/* 排行榜内容 */}
      {ranking && !loading && (
        <div>
          {/* 完整排行榜 */}
          <div className='bg-slate-800/30 rounded-lg shadow-xl border border-slate-600 backdrop-blur-sm'>
            <div className='space-y-2'>
              {ranking.rankings.map(item => (
                <RankingItem key={item.userId} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {ranking && ranking.rankings.length === 0 && !loading && (
        <div className='text-center py-12'>
          <div className='text-gray-300 text-lg mb-2'>暂无排名数据</div>
          <div className='text-gray-400'>快去练习打字吧！</div>
        </div>
      )}
    </div>
  );
}
