'use client';
import PlasmaWaveV2 from '@/blocks/PlasmaWaveV2/PlasmaWaveV2';
import Header from '@/components/Header';
import TypingText from '@/components/TypingText';
import useSpeech from '@/hooks/useSpeech';
import { Word } from '@/request/globals';
import { useEffect, useState } from 'react';
export default function Page() {
  const [word, setWord] = useState<Word>();

  useEffect(() => {
    Apis.general
      .WordsController_getRandomWords({
        params: {}
      })
      .then(res => {
        setWord(res.data[0]);
      });
  }, []);
  return (
    <div className='bg-black h-[100vh] w-screen flex flex-col'>
      <Header activeItem='home' />
      <PlasmaWaveV2 yOffset={-300} xOffset={0} rotationDeg={-30} />
      <TypingText word={word} />
    </div>
  );
}
