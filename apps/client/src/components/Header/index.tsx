'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useStars } from '@/hooks/useStarts';
import star from '@/assets/common/star.svg';
import Link from 'next/link';
import Image from 'next/image';

const DisplayHeader = ({ activeItem }: { activeItem: string }) => {
  const navRef = useRef(null);
  const starCountRef = useRef(null);
  const stars = useStars();

  const navList = [
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

  useEffect(() => {
    if (stars && starCountRef.current) {
      gsap.fromTo(
        starCountRef.current,
        {
          scale: 0,
          width: 0,
          opacity: 0
        },
        {
          scale: 1,
          width: '100px',
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1)'
        }
      );
    }
  }, [stars]);

  return (
    <header className='fixed top-0 left-0 right-0 z-50 h-[80px] pt-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        <Link
          href='/'
          className='flex items-center space-x-2 text-white transition-colors duration-200'
        >
          <div className='w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-white text-black'>
            T
          </div>
          <span className='font-semibold text-lg hidden sm:block'>Typing</span>
        </Link>

        <div className='flex items-center space-x-8'>
          <nav className='flex items-center space-x-6' ref={navRef}>
            <div className='flex items-center justify-between p-4 px-8 rounded-4xl backdrop-blur-2xl text-white gap-10 border border-white/10'>
              {navList.map(item => (
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

          <Link
            target='_blank'
            className='flex items-center justify-between py-1 px-4 rounded-4xl backdrop-blur-2xl text-white gap-2 border border-white/10 bg-gradient-to-r from-[#7c3aed] to-[#bb5dee] '
            style={{
              animationDuration: '6s'
            }}
            href='https://github.com/DavidHDev/react-bits'
          >
            <span>Star On GitHub</span>
            <div
              ref={starCountRef}
              style={{ opacity: 0 }}
              className='flex items-center justify-center space-x-2 bg-black py-3 rounded-4xl'
            >
              <Image src={star} alt='Star Icon' width={16} height={16} />
              <span>{stars}</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DisplayHeader;
