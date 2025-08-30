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
                • <strong>游戏化闯关</strong>
                ：通过有趣的关卡设计，让英语学习变得像游戏一样上瘾
              </p>
              <p>
                • <strong>独创长句拆解</strong>
                ：将复杂句子拆解成易懂片段，循序渐进掌握语法结构
              </p>
              <p>
                • <strong>海量重复练习</strong>
                ：科学的重复机制，确保核心词汇深度记忆
              </p>
              <p>
                • <strong>流利口语训练</strong>
                ：结合发音练习，提升口语表达的流利度和准确性
              </p>
              <p>
                • <strong>地道表达学习</strong>
                ：涵盖中小学、四六级、考研雅思、商务英语等各类场景
              </p>
            </div>
          </div>
          <div className='bg-purple-800 rounded-lg p-6'>
            <h3 className='text-white text-xl mb-4'>📖 使用指南</h3>
            <div className='text-gray-300 space-y-3'>
              <p>
                <strong>1. 选择学习目标</strong>
              </p>
              <p className='ml-4'>
                根据需求选择中小学、四六级、考研雅思或商务英语等学习路径
              </p>
              <p>
                <strong>2. 游戏化闯关</strong>
              </p>
              <p className='ml-4'>
                通过有趣的关卡挑战，在游戏中自然掌握核心词汇和语法
              </p>
              <p>
                <strong>3. 长句拆解练习</strong>
              </p>
              <p className='ml-4'>
                利用独创的长句拆解功能，将复杂句子分解为易理解的片段
              </p>
              <p>
                <strong>4. 重复强化记忆</strong>
              </p>
              <p className='ml-4'>
                通过科学的重复练习机制，确保学习内容深度记忆
              </p>
            </div>
          </div>
          <div className='bg-purple-800 rounded-lg p-6'>
            <h3 className='text-white text-xl mb-4'>💡 学习技巧</h3>
            <div className='text-gray-300 space-y-3'>
              <p>
                <strong>循序渐进</strong>
                ：从基础词汇开始，逐步挑战更复杂的语法和表达
              </p>
              <p>
                <strong>重复记忆</strong>
                ：利用遗忘曲线原理，通过多次重复强化记忆效果
              </p>
              <p>
                <strong>情境学习</strong>
                ：在具体语境中学习单词和句型，提高实际应用能力
              </p>
              <p>
                <strong>口语结合</strong>
                ：边学边说，将文字学习与口语练习相结合
              </p>
              <p>
                <strong>快捷键使用</strong>
                ：⌘+R 重置练习、⌘+P 发音、⌘+H 提示、Space/Enter 提交答案
              </p>
              <p>
                <strong>持续坚持</strong>
                ：每天坚持学习，养成良好的英语学习习惯
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
