'use client';
import PlasmaWaveV2 from '@/blocks/PlasmaWaveV2/PlasmaWaveV2';
import Header from '@/components/Header/Header';
import TypingText from '@/components/TypingText';
import { INITAIL_WORD } from '@/constant';
export default function Page() {
  return (
    <div className='bg-black h-[100vh] w-screen flex flex-col'>
      <Header activeItem='home' />
      <PlasmaWaveV2 yOffset={-300} xOffset={0} rotationDeg={-30} />
      <TypingText word={INITAIL_WORD} />
    </div>
  );
}
