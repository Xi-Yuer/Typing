'use client';
import { useRef } from 'react';
import Link from 'next/link';
import type { NavItem, NavigationProps } from './types';

const defaultNavItems: NavItem[] = [
  {
    name: '首页',
    href: '/'
  },
  {
    name: '广场',
    href: '/list'
  },
  {
    name: '我的',
    href: '/dashboard/main'
  }
];

const Navigation = ({
  activeItem,
  navItems = defaultNavItems
}: NavigationProps) => {
  const navRef = useRef(null);

  return (
    <nav className='flex items-center' ref={navRef}>
      <div className='flex items-center p-2 sm:p-3 lg:p-3.5 px-3 sm:px-6 lg:px-7 rounded-4xl backdrop-blur-2xl text-white gap-3 sm:gap-4 lg:gap-6 xl:gap-9 border border-white/10 whitespace-nowrap'>
        {navItems.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-xs sm:text-sm lg:text-base lg:space-x-2 transition-opacity duration-200 whitespace-nowrap ${
              activeItem === item.href.toLowerCase()
                ? 'active-link opacity-100'
                : 'opacity-80 hover:opacity-100'
            }`}>
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
export type { NavItem, NavigationProps };
