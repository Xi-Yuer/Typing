import React from 'react';
import {
  Gamepad2,
  Puzzle,
  RotateCcw,
  Mic,
  BookOpen,
  Zap,
  Dot
} from 'lucide-react';

export default function MoreAction() {
  return (
    <div className='min-h-screen bg-slate-950'>
      <div className='max-w-6xl mx-auto px-6 py-16'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold text-white mb-4'>功能特性</h1>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
            高效英语学习平台，让语言学习变得简单有趣
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          <div className='bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4'>
              <Gamepad2 className='w-6 h-6 text-blue-400' />
            </div>
            <h3 className='text-lg font-semibold text-white mb-2'>
              游戏化学习
            </h3>
            <p className='text-gray-300 text-sm'>
              通过关卡挑战，让英语学习像游戏一样有趣
            </p>
          </div>

          <div className='bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4'>
              <Puzzle className='w-6 h-6 text-green-400' />
            </div>
            <h3 className='text-lg font-semibold text-white mb-2'>长句拆解</h3>
            <p className='text-gray-300 text-sm'>
              将复杂句子拆解成易懂片段，循序渐进掌握语法
            </p>
          </div>

          <div className='bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4'>
              <RotateCcw className='w-6 h-6 text-purple-400' />
            </div>
            <h3 className='text-lg font-semibold text-white mb-2'>科学重复</h3>
            <p className='text-gray-300 text-sm'>
              基于遗忘曲线的重复机制，确保深度记忆
            </p>
          </div>

          <div className='bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4'>
              <Mic className='w-6 h-6 text-orange-400' />
            </div>
            <h3 className='text-lg font-semibold text-white mb-2'>口语训练</h3>
            <p className='text-gray-300 text-sm'>
              结合发音练习，提升口语表达的流利度
            </p>
          </div>

          <div className='bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4'>
              <BookOpen className='w-6 h-6 text-red-400' />
            </div>
            <h3 className='text-lg font-semibold text-white mb-2'>
              多场景学习
            </h3>
            <p className='text-gray-300 text-sm'>
              涵盖中小学、四六级、考研雅思、商务英语等场景
            </p>
          </div>

          <div className='bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4'>
              <Zap className='w-6 h-6 text-indigo-400' />
            </div>
            <h3 className='text-lg font-semibold text-white mb-2'>快捷操作</h3>
            <p className='text-gray-300 text-sm'>
              丰富的快捷键支持，提升学习效率
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <div className='bg-slate-800 rounded-2xl p-8'>
          <h2 className='text-2xl font-bold text-white mb-6 text-center'>
            快速开始
          </h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-semibold text-white mb-4'>
                学习流程
              </h3>
              <div className='space-y-3'>
                <div className='flex items-start space-x-3'>
                  <Dot className='w-6 h-6 text-blue-400' />
                  <p className='text-gray-300 text-sm'>
                    选择学习目标（中小学/四六级/考研雅思/商务英语）
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <Dot className='w-6 h-6 text-blue-400' />
                  <p className='text-gray-300 text-sm'>
                    通过游戏化关卡挑战掌握核心词汇
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <Dot className='w-6 h-6 text-blue-400' />
                  <p className='text-gray-300 text-sm'>
                    利用长句拆解功能理解复杂语法
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <Dot className='w-6 h-6 text-blue-400' />
                  <p className='text-gray-300 text-sm'>
                    重复练习强化记忆，持续提升
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-white mb-4'>快捷键</h3>
              <div className='space-y-2'>
                <div className='flex justify-between items-center py-2 border-b border-slate-700'>
                  <span className='text-gray-300 text-sm'>重置练习</span>
                  <kbd className='px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs'>
                    ⌘ + R
                  </kbd>
                </div>
                <div className='flex justify-between items-center py-2 border-b border-slate-700'>
                  <span className='text-gray-300 text-sm'>发音</span>
                  <kbd className='px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs'>
                    ⌘ + P
                  </kbd>
                </div>
                <div className='flex justify-between items-center py-2 border-b border-slate-700'>
                  <span className='text-gray-300 text-sm'>提示</span>
                  <kbd className='px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs'>
                    ⌘ + H
                  </kbd>
                </div>
                <div className='flex justify-between items-center py-2'>
                  <span className='text-gray-300 text-sm'>提交答案</span>
                  <kbd className='px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs'>
                    Space / Enter
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
