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
      className='flex items-center justify-between py-1 px-4 rounded-4xl backdrop-blur-2xl text-white gap-2 border border-white/10 bg-gradient-to-r from-[#7c3aed] to-[#bb5dee]'
      style={{
        animationDuration: '6s'
      }}
      href={href}
    >
      <span>Star On GitHub</span>
      <div
        ref={starCountRef}
        style={{ opacity: 1 }}
        className='flex items-center justify-center space-x-2 bg-slate-950 py-3 px-5 rounded-4xl'
      >
        <Image src={star} alt='Star Icon' width={16} height={16} />
        <span>{stars}</span>
      </div>
    </Link>
  );
};

export default GitHubStarButton;
export type { GitHubStarButtonProps };
