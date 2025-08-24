'use client';
import { useRef } from 'react';
import Link from 'next/link';
import type { NavItem, NavigationProps } from './types';

const defaultNavItems: NavItem[] = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Docs',
    href: '/text-animations/split-text'
  },
  {
    name: 'Showcase',
    href: '/showcase'
  }
];

const Navigation = ({
  activeItem,
  navItems = defaultNavItems
}: NavigationProps) => {
  const navRef = useRef(null);

  return (
    <nav className='flex items-center space-x-6' ref={navRef}>
      <div className='flex items-center justify-between p-4 px-8 rounded-4xl backdrop-blur-2xl text-white gap-10 border border-white/10'>
        {navItems.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className={
              activeItem === item.name.toLowerCase()
                ? 'active-link opacity-100'
                : 'opacity-80'
            }
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
export type { NavItem, NavigationProps };
