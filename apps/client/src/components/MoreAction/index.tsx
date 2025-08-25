import React from 'react';

export default function MoreAction() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-[#281450] p-8'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-white text-3xl font-bold mb-8 text-center'>
          更多内容
        </h2>
        <div className='space-y-8'>
          <div className='bg-purple-800 rounded-lg p-6'>
            <h3 className='text-white text-xl mb-4'>🚀 功能介绍</h3>
            <div className='text-gray-300 space-y-3'>
              <p>
                • <strong>智能打字练习</strong>
                ：提供多种难度级别的打字练习，从基础字母到复杂单词
              </p>
              <p>
                • <strong>实时速度统计</strong>
                ：准确计算您的打字速度（WPM）和准确率
              </p>
              <p>
                • <strong>个性化练习</strong>
                ：根据您的打字水平自动调整练习内容
              </p>
              <p>
                • <strong>进度追踪</strong>
                ：详细记录您的练习历史和进步轨迹
              </p>
              <p>
                • <strong>多语言支持</strong>
                ：支持中文、英文等多种语言的打字练习
              </p>
            </div>
          </div>
          <div className='bg-purple-800 rounded-lg p-6'>
            <h3 className='text-white text-xl mb-4'>📖 使用指南</h3>
            <div className='text-gray-300 space-y-3'>
              <p>
                <strong>1. 开始练习</strong>
              </p>
              <p className='ml-4'>点击上方的打字区域，开始您的打字练习之旅</p>
              <p>
                <strong>2. 选择难度</strong>
              </p>
              <p className='ml-4'>
                根据您的水平选择合适的练习难度，从初级到高级
              </p>
              <p>
                <strong>3. 专注练习</strong>
              </p>
              <p className='ml-4'>
                保持正确的坐姿，使用标准指法，专注于准确性而非速度
              </p>
              <p>
                <strong>4. 查看统计</strong>
              </p>
              <p className='ml-4'>练习结束后查看详细的速度和准确率统计</p>
            </div>
          </div>
          <div className='bg-purple-800 rounded-lg p-6'>
            <h3 className='text-white text-xl mb-4'>💡 练习技巧</h3>
            <div className='text-gray-300 space-y-3'>
              <p>
                <strong>正确指法</strong>
                ：使用十指盲打法，每个手指负责特定的按键区域
              </p>
              <p>
                <strong>保持节奏</strong>
                ：匀速打字比快速但不稳定的打字更有效
              </p>
              <p>
                <strong>定期练习</strong>
                ：每天坚持15-30分钟的练习，效果最佳
              </p>
              <p>
                <strong>错误纠正</strong>
                ：发现错误时立即纠正，养成良好的打字习惯
              </p>
              <p>
                <strong>放松心态</strong>
                ：保持轻松的心态，避免紧张导致的错误
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
