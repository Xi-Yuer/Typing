'use client';
import { useState } from 'react';
import Link from 'next/link';
import IconFont from '@/components/IconFont';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'home', name: '主页', href: '/dashboard/main', icon: 'icon-home' },
  {
    id: 'rangking',
    name: '排行榜',
    href: '/dashboard/rangking',
    icon: 'icon-rangking'
  },
  {
    id: 'review',
    name: '单词复习',
    href: '/dashboard/review',
    icon: 'icon-review'
  },
  {
    id: 'mistake',
    name: '错题本',
    href: '/dashboard/mistake',
    icon: 'icon-mistake'
  },
  {
    id: 'corpus',
    name: '我的词库',
    href: '/dashboard/corpus',
    icon: 'icon-my-corpus'
  },
  {
    id: 'custom',
    name: '自定义',
    href: '/dashboard/custom',
    icon: 'icon-custom'
  }
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('home'); // 默认选中主页

  return (
    <div className='w-64 bg-slate-900 h-fit border-r border-slate-700 flex flex-col rounded-xl'>
      <div className=''>
        <nav className='space-y-2 px-4 py-6'>
          {navItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeItem === item.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <IconFont type={item.icon} size={24} />
              <span className='font-medium'>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className='px-4 py-2 border-t border-slate-700'>
        <Link
          href='/settings'
          className='flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors duration-200'
        >
          <IconFont type='icon-setting' size={24} />
          <span className='font-medium'>设置</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
