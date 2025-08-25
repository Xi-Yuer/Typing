'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PlasmaWaveV2 from '@/blocks/PlasmaWaveV2/PlasmaWaveV2';
import Header from '@/components/Header/Header';
import TypingText from '@/components/TypingText';
import { Welcome } from '@/components/Welcome';
import { INITAIL_WORD } from '@/constant';
import { DoubleRightOutlined } from '@ant-design/icons';
import MoreAction from '@/components/MoreAction';

export default function Page() {
  const [showTyping, setShowTyping] = useState(false);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const plasmaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 初始状态设置
    gsap.set([welcomeRef.current, typingRef.current], { opacity: 0 });
    gsap.set(headerRef.current, { y: -100, opacity: 0 });
    gsap.set(plasmaRef.current, { scale: 0.8, opacity: 0 });

    // 动画序列
    tl.to(plasmaRef.current, {
      scale: 1,
      opacity: 0.8,
      duration: 1.5,
      ease: 'power2.out'
    })
      .to(
        headerRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)'
        },
        '-=1'
      )
      .to(
        welcomeRef.current,
        {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out'
        },
        '-=0.5'
      )
      .call(() => {
        // Welcome动画完成后，等待2秒再显示TypingText
        setTimeout(() => {
          // Welcome组件淡出
          gsap.to(welcomeRef.current, {
            opacity: 0,
            y: -30,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => {
              setShowTyping(true);
            }
          });
        }, 2000);
      });

    return () => {
      tl.kill();
    };
  }, []);

  // 监听showTyping状态变化，执行TypingText动画
  useEffect(() => {
    if (showTyping && typingRef.current) {
      gsap.fromTo(
        typingRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'back.out(1.7)'
        }
      );
    }
  }, [showTyping]);

  return (
    <div className='bg-black min-h-screen w-screen relative'>
      {/* 背景动画层 - 固定在第一屏 */}
      <div ref={plasmaRef} className='fixed inset-0 z-0'>
        <PlasmaWaveV2 yOffset={-300} xOffset={0} rotationDeg={-30} />
      </div>

      {/* Header - 固定在顶部 */}
      <div ref={headerRef} className='fixed top-0 left-0 right-0 z-[60]'>
        <Header activeItem='home' />
      </div>

      {/* Welcome 全屏显示 */}
      <div
        ref={welcomeRef}
        className='fixed inset-0 z-40 flex items-center justify-center'>
        <Welcome />
      </div>

      {/* 主要内容区域 */}
      <div className='relative z-50'>
        {/* 第一屏 - TypingText */}
        <div className='h-screen flex-col mt-16 flex items-center relative justify-center'>
          {showTyping && (
            <div ref={typingRef} style={{ opacity: 0 }}>
              <TypingText word={INITAIL_WORD} />
            </div>
          )}
          {showTyping && (
            <div className='text-purple-400 absolute bottom-20 cursor-pointer rotate-90'>
              <DoubleRightOutlined className='text-3xl animate-pulse' />
            </div>
          )}
        </div>

        {/* 更多内容区域 */}
        {showTyping && <MoreAction />}
      </div>
    </div>
  );
}
