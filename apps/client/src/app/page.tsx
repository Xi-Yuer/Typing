'use client';
import PlasmaWaveV2 from '@/blocks/PlasmaWaveV2/PlasmaWaveV2';
import Header from '@/components/Header';
import TypingText from '@/components/TypingText';
import useSpeech from '@/hooks/useSpeech';
import { Word } from '@/request/globals';
export default function Page() {
  const word: any = {
    id: '14447',
    languageId: 1,
    categoryId: '9',
    word: 'dribble',
    transliteration: '',
    usPhonetic: 'ˈdrɪbl',
    ukPhonetic: 'ˈdrɪbl',
    meaning:
      'v. 流（口水），垂（涎）；滴下，细流；运球 n. 点滴，细流；口水；运球；蠢话，馊主意',
    example: null,
    audioUrl: null,
    imageUrl: null,
    createdAt: '2025-08-15T11:49:48.762Z',
    updatedAt: '2025-08-17T03:13:58.463Z',
    deletedAt: null,
    language: {
      id: 1,
      name: '英语',
      code: 'en',
      script: 'Latin',
      isActive: true,
      createTime: '2025-08-15T11:49:38.456Z',
      updateTime: '2025-08-15T11:49:38.456Z',
      deleteTime: null
    },
    category: {
      id: '9',
      languageId: 1,
      name: 'RAZ分级',
      description: 'RAZ分级相关词汇',
      difficulty: 1,
      createTime: '2025-08-15T11:49:46.518Z',
      updateTime: '2025-08-15T11:49:46.518Z',
      deleteTime: null
    }
  };
  return (
    <div className='bg-black h-[100vh] w-screen flex flex-col'>
      <Header activeItem='home' />
      <PlasmaWaveV2 yOffset={-300} xOffset={0} rotationDeg={-30} />
      <TypingText word={word} />
    </div>
  );
}
