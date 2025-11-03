'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Popover } from 'antd';
import { useClickAway } from 'ahooks';
import Apis from '@/request';
import { throttle } from '@/utils';

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
  onResultClick?: (word: any) => void;
}

const SearchBox = ({
  className = '',
  placeholder = '搜索单词...',
  onResultClick
}: SearchBoxProps) => {
  // 搜索相关状态
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // 搜索单词
  const searchWords = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await Apis.general.WordsController_searchWordsPaginated({
        params: {
          keyword: keyword.trim(),
          page: 1,
          pageSize: 5 // 只显示前5个结果
        }
      });

      if (response?.data?.list) {
        setSearchResults(response.data.list);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // 移除自动搜索，改为手动触发

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 使用 useRef 存储节流搜索函数，避免重复创建
  const throttledSearchRef = useRef(
    throttle((keyword: string) => {
      if (keyword.trim()) {
        searchWords(keyword);
      }
    }, 500)
  );

  // 监听搜索查询变化，触发节流搜索
  useEffect(() => {
    if (searchQuery.trim()) {
      throttledSearchRef.current(searchQuery);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // 使用 useClickAway 处理点击外部关闭 Popover
  useClickAway(
    () => {
      if (showSearchResults) {
        setShowSearchResults(false);
      }
    },
    [
      searchBoxRef,
      () => document.querySelector('.ant-popover-content'),
      () => document.querySelector('.ant-popover')
    ],
    'mousedown'
  );

  // 处理回车键搜索
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        searchWords(searchQuery);
      }
    }
  };

  // 处理搜索图标点击
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      searchWords(searchQuery);
    }
  };

  // 处理发音功能
  const handlePronounce = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US'; // 设置为英语发音
      utterance.rate = 0.8; // 稍微慢一点
      speechSynthesis.speak(utterance);
    }
  };

  // 处理搜索输入焦点
  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  // 处理搜索结果点击
  const handleResultClick = (word: any) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);

    // 调用外部传入的回调函数
    if (onResultClick) {
      onResultClick(word);
    }
  };

  // 搜索结果内容组件
  const SearchResultsContent = () => {
    if (searchResults.length > 0) {
      return (
        <div className='py-3 max-h-96 overflow-y-auto bg-slate-800/90 backdrop-blur-md'>
          {searchResults.map((word, index) => (
            <div
              key={word.id || index}
              onClick={() => handleResultClick(word)}
              className='px-4 py-3 hover:bg-orange-500/8 cursor-pointer transition-colors duration-200 border-b border-orange-500/5 last:border-b-0'>
              <div className='flex items-start justify-between gap-3'>
                <div className='flex-1 min-w-0'>
                  {/* 单词和发音按钮 */}
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='font-semibold text-white text-base'>
                      {word.word}
                    </span>
                    {word.transliteration && (
                      <span className='text-sm text-orange-300 font-mono'>
                        /{word.transliteration}/
                      </span>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handlePronounce(word.word);
                      }}
                      className='p-1 text-orange-400/60 hover:text-orange-300 hover:bg-orange-500/8 rounded transition-colors'
                      title='发音'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
                        />
                      </svg>
                    </button>
                  </div>

                  {/* 音标信息 */}
                  {word.ukPhonetic && (
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-xs text-gray-400 font-mono'>
                        英式音标: /{word.ukPhonetic}/
                      </span>
                      {word.usPhonetic && (
                        <span className='text-xs text-gray-400 font-mono'>
                          美式音标: /{word.usPhonetic}/
                        </span>
                      )}
                    </div>
                  )}

                  {/* 中文释义 */}
                  <div className='text-sm text-gray-200 mb-2 leading-relaxed'>
                    {word.meaning}
                  </div>

                  {/* 简短释义 */}
                  {word.meaningShort && word.meaningShort !== word.meaning && (
                    <div className='text-xs text-gray-500 mb-2'>
                      {word.meaningShort}
                    </div>
                  )}

                  {/* 例句 */}
                  {word.example && (
                    <div className='text-xs text-gray-400 italic bg-orange-500/3 px-2 py-1 rounded border-l-2 border-orange-500/10'>
                      "{word.example}"
                    </div>
                  )}

                  {/* 更新时间 */}
                  {word.updatedAt && (
                    <div className='flex items-center gap-2 mt-2'>
                      <span className='text-xs text-gray-500'>
                        更新: {new Date(word.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* 标签区域 */}
                <div className='flex flex-col items-end gap-1 ml-2 flex-shrink-0'>
                  {word.language && (
                    <span className='text-xs px-2 py-1 bg-orange-500/5 text-orange-300/60 rounded-full border border-orange-500/10'>
                      {word.language.name}
                    </span>
                  )}
                  {word.category && (
                    <span className='text-xs px-2 py-1 bg-orange-400/5 text-orange-200/60 rounded-full border border-orange-400/10'>
                      {word.category.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (searchQuery && !isSearching) {
      return (
        <div className='p-6 text-center text-gray-400 text-sm bg-slate-800/90 backdrop-blur-md'>
          <div className='mb-2'>
            <svg
              className='w-8 h-8 mx-auto text-gray-500 mb-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          未找到相关单词
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={searchBoxRef} className={`relative ${className}`}>
      <Popover
        content={<SearchResultsContent />}
        open={
          showSearchResults &&
          (!!searchQuery.trim() || searchResults.length > 0)
        }
        onOpenChange={open => {
          // 只有在有搜索查询或结果时才允许打开
          if (open && !searchQuery.trim() && searchResults.length === 0) {
            return;
          }
          setShowSearchResults(open);
        }}
        placement='bottomLeft'
        trigger={[]}
        classNames={{ root: 'search-results-popover' }}
        styles={{
          body: {
            background: 'rgba(30, 41, 59, 0.9)',
            backdropFilter: 'blur(16px)',
            maxWidth: '700px',
            minWidth: '300px'
          }
        }}
        style={{
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(251, 146, 60, 0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
          padding: 0,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
        arrow={false}>
        <div className='relative'>
          <input
            ref={searchInputRef}
            type='text'
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            onFocus={handleSearchFocus}
            className='w-full px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-sm sm:text-base bg-orange-500/5 border border-orange-500/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400/40 backdrop-blur-sm transition-all duration-200 hover:bg-orange-500/8'
          />
          <div
            className='absolute right-3 sm:right-4 lg:right-5 top-1/2 transform -translate-y-1/2 cursor-pointer'
            onClick={handleSearchClick}>
            {isSearching ? (
              <div className='w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white/80 rounded-full animate-spin'></div>
            ) : (
              <svg
                className='w-4 h-4 sm:w-5 sm:h-5 text-white/60 hover:text-white/80 transition-colors'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default SearchBox;
