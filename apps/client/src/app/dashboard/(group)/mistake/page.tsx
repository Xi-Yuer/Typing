'use client';
import { getUserErrorRecordsCategories } from '@/api';
import { useEffect, useState } from 'react';
import { CategoryWithErrorsDto } from '@/request/globals';
import { getDifficultyStyle } from '@/utils';
import { useGameModeContext } from '@/contexts/GameModeContext';
import GameModeModal from '@/components/GameModeModal';
import { useRouter } from 'next/navigation';
export default function Mistake() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithErrorsDto[]>([]);
  const [currentCategory, setCurrentCategory] =
    useState<CategoryWithErrorsDto | null>(null);
  const [error, setError] = useState<string>('');
  const {
    openModeModal,
    isModalOpen,
    closeModeModal,
    currentMode,
    changeMode
  } = useGameModeContext();

  useEffect(() => {
    getUserErrorRecordsCategories(1, 100).then(res => {
      if (res && res.code === 200) {
        setCategories(res.data.list);
      } else {
        setError(res?.message || '获取错词记录分类列表失败');
      }
    });
  }, []);

  return (
    <div className='grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 min-h-[200px] relative'>
      {categories?.map(category => {
        const difficultyStyle = getDifficultyStyle(category.difficulty);

        return (
          <div
            key={category.id}
            className='bg-white/10 !h-[150px] overflow-hidden backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/10 relative'>
            {/* 右上角难度标签 */}
            <div
              className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                difficultyStyle.bg
              } ${difficultyStyle.text} ${difficultyStyle.border} border`}>
              {difficultyStyle.label}
            </div>

            {/* 标题 */}
            <h3 className='text-lg font-semibold text-white mb-2 pr-16 line-clamp-1'>
              {category.name}
            </h3>

            <p className='text-gray-300 text-sm mb-4 line-clamp-2'>
              {category.description}
            </p>
            <span
              className='flex items-center text-purple-400'
              onClick={() => {
                setCurrentCategory(category);
                openModeModal();
              }}>
              <span className='text-sm'>开始练习</span>
              <svg
                className='w-4 h-4 ml-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </span>
          </div>
        );
      })}
      {categories?.length === 0 && (
        <div className='text-purple-400 text-lg w-full h-full flex items-center justify-center absolute top-0 left-0'>
          错误: {error}
        </div>
      )}
      {/* 游戏模式选择弹窗 */}
      <GameModeModal
        isOpen={isModalOpen}
        onClose={closeModeModal}
        currentMode={currentMode}
        onModeChange={mode => {
          router.push(
            `/mistake?categoryId=${currentCategory?.id}&languageId=${currentCategory?.languageId}`
          );
          changeMode(mode);
        }}
      />
    </div>
  );
}
