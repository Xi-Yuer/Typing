'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconFont from '@/components/IconFont';
import { ShipWheel } from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    name: '数据概览',
    href: '/dashboard/main',
    icon: 'icon-dashboard'
  },
  {
    id: 'rangking',
    name: '排行榜',
    href: '/dashboard/rangking',
    icon: 'icon-rangking'
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
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('home');

  // 根据当前路径设置激活状态
  useEffect(() => {
    const currentPath = pathname;

    // 查找匹配的导航项
    const matchedItem = navItems.find(item => {
      if (item.href === '/dashboard/main' && currentPath === '/dashboard') {
        return true; // 主页特殊处理
      }
      return currentPath === item.href;
    });

    if (matchedItem) {
      setActiveItem(matchedItem.id);
    } else if (currentPath === '/dashboard') {
      setActiveItem('home'); // 默认主页
    }
  }, [pathname]);

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
                  : 'text-white hover:bg-slate-800'
              }`}>
              <IconFont type={item.icon} size={24} />
              <span className='font-medium'>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className='px-4 py-2 border-t border-slate-700'>
        <Link
          href='/dashboard/about'
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-colors duration-200 ${
            activeItem === 'about'
              ? 'bg-purple-600 text-white'
              : 'text-white hover:bg-slate-800'
          }`}
          onClick={() => setActiveItem('about')}>
          <ShipWheel className='w-6 h-6 text-white' />
          <span className='font-medium'>关于</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
