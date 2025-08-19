'use client';
import PlasmaWaveV2 from '@/blocks/PlasmaWaveV2/PlasmaWaveV2';
import Header from '@/components/Header';
import TypingText from '@/components/TypingText';
import useSpeech from '@/hooks/useSpeech';
export default function Page() {
  const { speak, cancel, speaking } = useSpeech('我们最好了');
  return (
    <div className='bg-black h-[100vh] w-screen flex flex-col'>
      <Header activeItem='home' />
      <PlasmaWaveV2 yOffset={-300} xOffset={0} rotationDeg={-30} />
      <TypingText />
    </div>
  );
}
