import { useEffect, useRef } from 'react';

export const useTypingSound = () => {
  // 预加载音频对象，避免每次创建
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频对象
  useEffect(() => {
    try {
      typingAudioRef.current = new Audio('/sounds/typing.mp3');
      typingAudioRef.current.volume = 1;
      typingAudioRef.current.preload = 'auto';

      successAudioRef.current = new Audio('/sounds/right.mp3');
      successAudioRef.current.volume = 1;
      successAudioRef.current.preload = 'auto';

      errorAudioRef.current = new Audio('/sounds/error.mp3');
      errorAudioRef.current.volume = 1;
      errorAudioRef.current.preload = 'auto';
    } catch (e) {
      console.log('初始化音频失败:', e);
    }
  }, []);

  // 播放声音函数
  const playTypingSound = () => {
    if (typingAudioRef.current) {
      typingAudioRef.current.currentTime = 0; // 重置播放位置
      typingAudioRef.current
        .play()
        .catch(e => console.log('播放成功音效失败:', e));
    }
  };

  const playSuccessSound = () => {
    if (successAudioRef.current) {
      successAudioRef.current.currentTime = 0; // 重置播放位置
      successAudioRef.current
        .play()
        .catch(e => console.log('播放成功音效失败:', e));
    }
  };

  const playErrorSound = () => {
    if (errorAudioRef.current) {
      errorAudioRef.current.currentTime = 0; // 重置播放位置
      errorAudioRef.current
        .play()
        .catch(e => console.log('播放错误音效失败:', e));
    }
  };

  return {
    playTypingSound,
    playSuccessSound,
    playErrorSound
  };
};
