'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Apis from '@/request';

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
  const searchResultsRef = useRef<HTMLDivElement>(null);

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

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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

  return (
    <div className={`relative ${className}`}>
      <div className='relative'>
        <input
          ref={searchInputRef}
          type='text'
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          onFocus={handleSearchFocus}
          className='w-full px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-sm sm:text-base bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200'
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

      {/* 搜索结果下拉框 */}
      {showSearchResults && (
        <div
          ref={searchResultsRef}
          className='absolute top-full left-0 right-[-400px] mt-3 bg-gray-900/95 backdrop-blur-md border border-gray-600/50 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto'>
          {searchResults.length > 0 ? (
            <div className='py-3'>
              {searchResults.map((word, index) => (
                <div
                  key={word.id || index}
                  onClick={() => handleResultClick(word)}
                  className='px-4 py-3 hover:bg-gray-800/50 cursor-pointer transition-colors duration-200 border-b border-gray-700/30 last:border-b-0'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='flex-1 min-w-0'>
                      {/* 单词和发音按钮 */}
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='font-semibold text-white text-base'>
                          {word.word}
                        </span>
                        {word.transliteration && (
                          <span className='text-sm text-purple-300 font-mono'>
                            /{word.transliteration}/
                          </span>
                        )}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePronounce(word.word);
                          }}
                          className='p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors'
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
                      {word.meaningShort &&
                        word.meaningShort !== word.meaning && (
                          <div className='text-xs text-gray-500 mb-2'>
                            {word.meaningShort}
                          </div>
                        )}

                      {/* 例句 */}
                      {word.example && (
                        <div className='text-xs text-gray-400 italic bg-gray-800/30 px-2 py-1 rounded border-l-2 border-purple-500/30'>
                          "{word.example}"
                        </div>
                      )}

                      {/* 更新时间 */}
                      {word.updatedAt && (
                        <div className='flex items-center gap-2 mt-2'>
                          <span className='text-xs text-gray-500'>
                            更新:{' '}
                            {new Date(word.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 标签区域 */}
                    <div className='flex flex-col items-end gap-1 ml-2 flex-shrink-0'>
                      {word.language && (
                        <span className='text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30'>
                          {word.language.name}
                        </span>
                      )}
                      {word.category && (
                        <span className='text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30'>
                          {word.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && !isSearching ? (
            <div className='p-6 text-center text-gray-400 text-sm'>
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
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
