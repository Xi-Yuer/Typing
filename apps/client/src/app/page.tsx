'use client';
import PlasmaWaveV2 from '@/blocks/PlasmaWaveV2/PlasmaWaveV2';
import Header from '@/components/Header';
import TypingText from '@/components/TypingText';
import Apis from '@/request';
import { Word } from '@/request/globals';
import { useEffect, useState } from 'react';
export default function Page() {
  const [word, setWord] = useState<Word>();

  useEffect(() => {
    Apis.general
      .WordsController_getRandomWords({
        params: {
          count: 1,
          languageId: '5'
        }
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
