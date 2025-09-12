'use client';
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense
} from 'react';
import { useFullscreen } from 'ahooks';
import { useSearchParams } from 'next/navigation';
import {
  correctWord,
  getUserWordsProgress,
  getWordsByCategoryId,
  reportWordError
} from '@/api';
import { useGameModeContext } from '@/contexts/GameModeContext';
import { Button, Tooltip } from 'antd';
import TypingText from '@/components/TypingText';
import GameModeModal from '@/components/GameModeModal';
import WordErrorReportModal from '@/components/WordErrorReportModal';
import { Word } from '@/request/globals';
import IconFont from '@/components/IconFont';
import { useRouter } from 'next/navigation';

/**
 * 练习页面内部组件
 * 处理搜索参数和练习逻辑
 */
function PracticePageContent() {
  const searchParams = useSearchParams();
  const {
    currentMode,
    isModalOpen,
    changeMode,
    openModeModal,
    closeModeModal
  } = useGameModeContext();
  const [languageId, setLanguageId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [globalWordIndex, setGlobalWordIndex] = useState(0); // 全局单词索引
  const [isErrorReportModalOpen, setIsErrorReportModalOpen] = useState(false);
  const ref = useRef(null);
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref);
  const router = useRouter();

  /**
   * 从URL参数中获取languageId和categoryId
   */
  useEffect(() => {
    const langId = searchParams.get('languageId');
    const catId = searchParams.get('categoryId');
    setLanguageId(langId);
    setCategoryId(catId);
  }, [searchParams]);

  /**
   * 加载练习数据
   */
  const loadPracticeData = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      if (!languageId || !categoryId) return;

      const response = await getWordsByCategoryId(
        parseInt(languageId as string),
        parseInt(categoryId as string),
        page,
        pageSize
      );

      if (response && response.data && response.data.list) {
        const wordList = response.data.list;
        if (page === 1) {
          // 初始加载，替换所有数据
          setWords(wordList);
          setCurrentWordIndex(0);
          setTotal(response.data.total); // 只在初始加载时设置 total
        } else {
          // 预加载，追加数据
          setWords(prev => [...prev, ...wordList]);
        }

        setCurrentPage(page);
      }
    },
    [languageId, categoryId]
  );

  /**
   * 当参数获取到后，先获取用户进度，再加载练习数据
   */
  useEffect(() => {
    if (languageId && categoryId) {
      const initializePracticeData = async () => {
        try {
          // 先获取用户进度
          const { data: progressData } = await getUserWordsProgress(
            languageId as string,
            categoryId as string
          );

          // 设置用户进度信息
          setCurrentPage(progressData.page);
          setPageSize(progressData.pageSize);

          // 计算全局单词索引：基于用户进度
          const globalIndex = (progressData.page - 1) * progressData.pageSize;
          setGlobalWordIndex(globalIndex);

          // 使用获取到的分页信息加载练习数据
          await loadPracticeData(progressData.page, progressData.pageSize);
        } catch {
          // 如果获取用户进度失败，使用默认分页加载数据
          await loadPracticeData(1, 10);
        }
      };

      initializePracticeData();
    }
  }, [languageId, categoryId, loadPracticeData]);

  /**
   * 预加载下一批数据
   */
  const preloadNextBatch = useCallback(async () => {
    await loadPracticeData(currentPage + 1, pageSize);
  }, [currentPage, pageSize, loadPracticeData]);

  /**
   * 处理单词完成事件
   */
  const handleWordComplete = useCallback(
    async (_isCorrect: boolean) => {
      if (_isCorrect) {
        await correctWord(words[currentWordIndex].id);
      } else {
        // 记录错误
      }
    },
    [currentWordIndex, words]
  );

  /**
   * 切换到下一个单词
   */
  const handleNextWord = useCallback(() => {
    if (currentWordIndex < words.length - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setGlobalWordIndex(prev => prev + 1); // 更新全局索引

      // 当接近数据末尾时触发预加载
      if (nextIndex >= words.length - 3) {
        preloadNextBatch();
      }
    }
  }, [currentWordIndex, words.length, preloadNextBatch]);

  /**
   * 切换到上一个单词
   */
  const handlePrevWord = useCallback(() => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setGlobalWordIndex(prev => prev - 1); // 更新全局索引
    }
  }, [currentWordIndex]);

  /**
   * 处理错误上报
   */
  const handleReportError = useCallback(
    async (wordId: string, errorDescription: string) => {
      await reportWordError(wordId, errorDescription);
    },
    []
  );

  /**
   * 打开错误上报Modal
   */
  const openErrorReportModal = useCallback(() => {
    setIsErrorReportModalOpen(true);
  }, []);

  /**
   * 关闭错误上报Modal
   */
  const closeErrorReportModal = useCallback(() => {
    setIsErrorReportModalOpen(false);
  }, []);

  return (
    <div
      className='bg-slate-950 min-h-screen w-screen relative py-4 flex flex-col'
      ref={ref}>
      {/* 主要内容区域 */}
      <div className='flex flex-col'>
        {/* 进度指示器 */}
        <div className='fixed top-0 left-0 w-full h-1 bg-gray-700'>
          <div
            className='bg-purple-500 h-1 rounded-full transition-all duration-300'
            style={{
              width: `${((globalWordIndex + currentWordIndex + 1) / total) * 100}%`
            }}
          />
        </div>
        <div className='w-screen mx-auto h-[60px] border-b relative flex items-center justify-between px-4 border-b-gray-500/30'>
          {/* 单词信息 */}
          <div className='text-sm text-gray-300'>
            <span>
              {words?.[currentWordIndex]?.language.name} -
              {words?.[currentWordIndex]?.category.name} (
              {globalWordIndex + currentWordIndex + 1} / {total})
            </span>
          </div>
          {/* 功能区域 */}
          <div className='flex items-center space-x-3'>
            {/* 模式切换按钮 */}
            <Tooltip title='切换游戏模式'>
              <Button
                type='text'
                icon={<IconFont type='icon-game-mode' size={24} />}
                onClick={openModeModal}
                className='text-gray-400 hover:text-purple-300 border-none shadow-none'
              />
            </Tooltip>
            {/* 返回按钮 */}
            <Tooltip title='返回'>
              <Button
                type='text'
                icon={<IconFont type='icon-back' size={22} />}
                onClick={() => router.push('/list')}
                className='text-gray-400 hover:text-purple-300 border-none shadow-none'
              />
            </Tooltip>
            {/* 刷新按钮 */}
            <Tooltip title='刷新'>
              <Button
                type='text'
                icon={<IconFont type='icon-refresh' size={22} />}
                onClick={() => router.refresh()}
                className='text-gray-400 hover:text-purple-300 border-none shadow-none'
              />
            </Tooltip>
            {/* 错误上报按钮 */}
            <Tooltip title='报告单词错误'>
              <Button
                type='text'
                icon={<IconFont type='icon-error' size={22} />}
                onClick={openErrorReportModal}
                className='text-gray-400 hover:text-red-300 border-none shadow-none'
              />
            </Tooltip>
            {/* 全屏按钮 */}
            <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
              <Button
                type='text'
                icon={
                  isFullscreen ? (
                    <IconFont type='icon-fullscreen_in' size={22} />
                  ) : (
                    <IconFont type='icon-fullscreen_exc' size={22} />
                  )
                }
                onClick={toggleFullscreen}
                className='text-gray-400 hover:text-purple-300 border-none shadow-none'
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <div className='flex-1 flex justify-center items-end mb-20'>
        <TypingText
          word={words[currentWordIndex]}
          mode={currentMode}
          onComplete={handleWordComplete}
          onNext={handleNextWord}
          onPrev={handlePrevWord}
        />
      </div>

      {/* 游戏模式选择弹窗 */}
      <GameModeModal
        isOpen={isModalOpen}
        onClose={closeModeModal}
        currentMode={currentMode}
        onModeChange={changeMode}
      />

      {/* 错误上报弹窗 */}
      <WordErrorReportModal
        isOpen={isErrorReportModalOpen}
        onClose={closeErrorReportModal}
        word={words[currentWordIndex] || null}
        onSubmit={handleReportError}
      />
    </div>
  );
}

/**
 * 练习页面主组件
 * 使用Suspense包装内部组件以处理useSearchParams
 */
export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className='bg-slate-950 min-h-screen w-screen flex items-center justify-center text-white'>
          Loading...
        </div>
      }>
      <PracticePageContent />
    </Suspense>
  );
}
