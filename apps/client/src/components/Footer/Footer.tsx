'use client';
import React from 'react';
import Donation from '../Donation/Donation';

const Footer: React.FC = () => {
  return (
    <footer className='bg-slate-950 backdrop-blur-md border-t border-slate-700/50 mt-20 relative z-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* 网站信息 */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white'>拼写鸭</h3>
            <p className='text-slate-400 text-sm'>
              高效英语学习平台，让语言学习变得简单有趣
            </p>
          </div>

          {/* 快速链接 */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white'>快速导航</h3>
            <div className='space-y-2'>
              <a
                href='/dashboard/main'
                className='block text-slate-400 hover:text-white transition-colors text-sm'>
                学习中心
              </a>
              <a
                href='/dashboard/main'
                className='block text-slate-400 hover:text-white transition-colors text-sm'>
                练习模式
              </a>
              <a
                href='/list'
                className='block text-slate-400 hover:text-white transition-colors text-sm'>
                词库列表
              </a>
              <a
                href='/dashboard/mistake'
                className='block text-slate-400 hover:text-white transition-colors text-sm'>
                错题回顾
              </a>
            </div>
          </div>

          {/* 联系方式 */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white'>联系我们</h3>
            <div className='space-y-2'>
              <p className='text-slate-400 text-sm'>邮箱：2214380963@qq.com</p>
              <p className='text-slate-400 text-sm'>
                技术支持：2214380963@qq.com
              </p>
            </div>
          </div>

          {/* 打赏支持 */}
          <Donation />
        </div>

        {/* 分割线 */}
        <div className='border-t border-slate-700/50 mt-8 pt-6'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            {/* 版权信息 */}
            <div className='text-slate-400 text-sm'>
              © 2025 拼写鸭. All rights reserved.
            </div>

            {/* 备案信息 */}
            <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-slate-400 text-sm'>
              <div className='flex items-center space-x-2'>
                <span>域名：</span>
                <a
                  href='https://keycikeyci.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-purple-400 hover:text-purple-300 transition-colors'>
                  keycikeyci.com
                </a>
              </div>
              <a
                href='https://beian.miit.gov.cn/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2'>
                <span>备案号：</span>
                <span className='text-slate-300'>蜀ICP备 号</span>
              </a>
              <a
                href='https://beian.miit.gov.cn/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2'>
                <span>公安备案：</span>
                <span className='text-slate-300'>川公网安备 号</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
