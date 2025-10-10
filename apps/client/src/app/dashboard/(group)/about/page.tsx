import React from 'react';
import { Zap, ExternalLink, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className='max-w-4xl mx-auto p-6 space-y-8'>
      {/* 核心功能 */}
      <div className='bg-slate-800 rounded-xl p-6 border border-slate-700'>
        <h2 className='text-2xl font-semibold text-white mb-6 flex items-center gap-2'>
          <Zap className='text-yellow-400' size={24} />
          核心功能
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div className='bg-slate-700 rounded-lg p-4'>
            <h3 className='text-white font-medium mb-2'>多语言支持</h3>
            <p className='text-gray-400 text-sm'>
              支持英语、日语、韩语、德语等多种语言的打字练习
            </p>
          </div>

          <div className='bg-slate-700 rounded-lg p-4'>
            <h3 className='text-white font-medium mb-2'>多种练习模式</h3>
            <p className='text-gray-400 text-sm'>
              自由模式、限时模式、听打模式、默写模式
            </p>
          </div>

          <div className='bg-slate-700 rounded-lg p-4'>
            <h3 className='text-white font-medium mb-2'>实时反馈</h3>
            <p className='text-gray-400 text-sm'>
              实时显示打字速度、准确率和错误提示
            </p>
          </div>

          <div className='bg-slate-700 rounded-lg p-4'>
            <h3 className='text-white font-medium mb-2'>数据统计</h3>
            <p className='text-gray-400 text-sm'>
              历史记录查询和可视化图表展示进步曲线
            </p>
          </div>

          <div className='bg-slate-700 rounded-lg p-4'>
            <h3 className='text-white font-medium mb-2'>用户系统</h3>
            <p className='text-gray-400 text-sm'>
              注册登录、第三方登录、云端同步
            </p>
          </div>

          <div className='bg-slate-700 rounded-lg p-4'>
            <h3 className='text-white font-medium mb-2'>管理后台</h3>
            <p className='text-gray-400 text-sm'>
              语料库管理、用户管理、数据统计
            </p>
          </div>
        </div>
      </div>

      {/* 友链模块 */}
      <div className='bg-slate-800 rounded-xl p-6 border border-slate-700'>
        <h2 className='text-2xl font-semibold text-white mb-6 flex items-center gap-2'>
          <Globe className='text-green-400' size={24} />
          友情链接
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {/* 技术相关 */}
          <div className='bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-medium'>Next.js</h3>
              <ExternalLink className='text-gray-400' size={16} />
            </div>
            <p className='text-gray-400 text-sm mb-3'>React 全栈框架</p>
            <a
              href='https://nextjs.org'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              访问官网 →
            </a>
          </div>

          <div className='bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-medium'>NestJS</h3>
              <ExternalLink className='text-gray-400' size={16} />
            </div>
            <p className='text-gray-400 text-sm mb-3'>Node.js 后端框架</p>
            <a
              href='https://nestjs.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              访问官网 →
            </a>
          </div>

          <div className='bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-medium'>Tailwind CSS</h3>
              <ExternalLink className='text-gray-400' size={16} />
            </div>
            <p className='text-gray-400 text-sm mb-3'>实用优先的 CSS 框架</p>
            <a
              href='https://tailwindcss.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              访问官网 →
            </a>
          </div>

          {/* 学习资源 */}
          <div className='bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-medium'>MDN Web Docs</h3>
              <ExternalLink className='text-gray-400' size={16} />
            </div>
            <p className='text-gray-400 text-sm mb-3'>Web 开发权威文档</p>
            <a
              href='https://developer.mozilla.org'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              访问官网 →
            </a>
          </div>

          <div className='bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-medium'>TypeScript</h3>
              <ExternalLink className='text-gray-400' size={16} />
            </div>
            <p className='text-gray-400 text-sm mb-3'>JavaScript 的超集</p>
            <a
              href='https://www.typescriptlang.org'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              访问官网 →
            </a>
          </div>

          <div className='bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-medium'>React 官方文档</h3>
              <ExternalLink className='text-gray-400' size={16} />
            </div>
            <p className='text-gray-400 text-sm mb-3'>React 学习资源</p>
            <a
              href='https://react.dev'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              访问官网 →
            </a>
          </div>

          {/* 工具和服务 */}
          <div className='bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-medium'>Alibaba Cloud</h3>
              <ExternalLink className='text-gray-400' size={16} />
            </div>
            <p className='text-gray-400 text-sm mb-3'>前端部署平台</p>
            <a
              href='https://www.aliyun.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              访问官网 →
            </a>
          </div>

          <div className='bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-medium'>GitHub</h3>
              <ExternalLink className='text-gray-400' size={16} />
            </div>
            <p className='text-gray-400 text-sm mb-3'>代码托管平台</p>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              访问官网 →
            </a>
          </div>

          <div className='bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-medium'>Lucide Icons</h3>
              <ExternalLink className='text-gray-400' size={16} />
            </div>
            <p className='text-gray-400 text-sm mb-3'>精美的图标库</p>
            <a
              href='https://lucide.dev'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              访问官网 →
            </a>
          </div>
        </div>

        {/* 申请友链说明 */}
        <div className='mt-6 p-4 bg-slate-700 rounded-lg'>
          <h3 className='text-white font-medium mb-2'>申请友链</h3>
          <p className='text-gray-400 text-sm'>
            如果您有相关的技术博客、开源项目或学习资源，欢迎申请友链。
            请确保网站内容健康、技术相关，且具有一定的访问量。
          </p>
          <div className='mt-3'>
            <a
              href='mailto:2214380963@qq.com'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
              联系邮箱：2214380963@qq.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
