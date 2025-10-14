'use client';
import React, { useCallback, useState } from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { CustomPackage as ApiCustomPackage } from '@/request/globals';
import { getDifficultyStyle } from '@/utils';
import GameModeModal from '@/components/GameModeModal';
import { useGameModeContext } from '@/contexts/GameModeContext';
import { useRouter } from 'next/navigation';

type CustomPackage = ApiCustomPackage;

interface PackageCardProps {
  pkg: CustomPackage;
  packageType: 'my' | 'public';
  onDelete: (id: string) => void;
  onImport?: (id: string) => void;
}

export default function PackageCard({
  pkg,
  packageType,
  onDelete,
  onImport
}: PackageCardProps) {
  const difficultyStyle = getDifficultyStyle(pkg.difficulty);
  const { currentMode, changeMode } = useGameModeContext();
  const router = useRouter();

  // 每个 PackageCard 都有自己的弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 打开弹窗
  const openModeModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // 关闭弹窗
  const closeModeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div
      className='bg-white/10 !h-[150px] overflow-hidden backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/10 relative'
      onClick={() => openModeModal()}>
      {/* 右上角难度标签 */}
      <div
        className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
          difficultyStyle.bg
        } ${difficultyStyle.text} ${difficultyStyle.border} border`}>
        {difficultyStyle.label}
      </div>

      {/* 标题 */}
      <h3 className='text-lg font-semibold text-white mb-2 pr-16 line-clamp-1'>
        {pkg.name}
      </h3>

      <p className='text-gray-300 text-sm mb-4 line-clamp-2'>
        {pkg.description}
      </p>

      <span className='flex items-center text-purple-400'>
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

      {/* 操作按钮 */}
      <div className='flex justify-end items-center translate-x-5'>
        <div className='flex'>
          {packageType === 'my' && (
            <>
              <Tooltip title='导入单词'>
                <Button
                  type='text'
                  icon={<UploadOutlined />}
                  className='text-green-400 hover:text-green-300 hover:bg-green-500/10'
                  onClick={e => {
                    e.stopPropagation();
                    onImport?.(pkg.id);
                  }}
                />
              </Tooltip>
              <Popconfirm
                title='确定要删除这个词库吗？'
                description='删除后无法恢复，包含的所有单词也会被删除。'
                onConfirm={e => {
                  e?.stopPropagation();
                  onDelete(pkg.id);
                }}
                okText='确定'
                cancelText='取消'>
                <Tooltip title='删除'>
                  <Button
                    type='text'
                    icon={<DeleteOutlined />}
                    onClick={e => e.stopPropagation()}
                    className='text-red-400 hover:text-red-300 hover:bg-red-500/10'
                  />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </div>
      </div>
      {/* 游戏模式选择弹窗 */}
      <GameModeModal
        isOpen={isModalOpen}
        onClose={closeModeModal}
        currentMode={currentMode}
        onModeChange={mode => {
          router.push(`/custom?packageId=${pkg.id}`);
          changeMode(mode);
        }}
      />
    </div>
  );
}
