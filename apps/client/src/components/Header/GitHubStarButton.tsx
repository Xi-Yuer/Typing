'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import star from '@/assets/common/star.svg';
import type { GitHubStarButtonProps } from './types';

const GitHubStarButton = ({
  stars,
  href = 'https://github.com/xi-yuer/typing'
}: GitHubStarButtonProps) => {
  const starCountRef = useRef(null);

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
    <Link
      target='_blank'
      className='flex items-center py-1 sm:py-1.5 lg:py-1.5 px-2 sm:px-3 lg:px-3.5 xl:px-4 rounded-4xl backdrop-blur-2xl text-white gap-1 sm:gap-2 lg:gap-2.5 border border-white/10 bg-gradient-to-r from-orange-600 to-orange-700 whitespace-nowrap'
      style={{
        animationDuration: '6s'
      }}
      href={href}>
      <span className='text-xs sm:text-sm lg:text-sm hidden lg:inline'>
        Star On GitHub
      </span>
      <span className='text-xs sm:text-sm hidden sm:inline lg:hidden'>
        Star
      </span>
      <div
        ref={starCountRef}
        style={{ opacity: 1 }}
        className='flex items-center justify-center space-x-1 sm:space-x-2 bg-slate-950 py-1.5 sm:py-2 lg:py-2 px-2 sm:px-3 lg:px-3.5 rounded-4xl'>
        <Image
          src={star}
          alt='Star Icon'
          width={12}
          height={12}
          className='sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5'
        />
        <span className='text-xs sm:text-sm lg:text-sm'>{stars}</span>
      </div>
    </Link>
  );
};

export default GitHubStarButton;
export type { GitHubStarButtonProps };
