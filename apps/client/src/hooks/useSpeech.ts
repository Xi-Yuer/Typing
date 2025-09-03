import { Word } from '@/request/globals';
import { YouDaoResponseType } from 'common';

let currentAudio: HTMLAudioElement | null = null;

/**
 * 获取语音数据
 * @param input 要转换的文本
 * @param language 语言代码
 * @param voice 可选的语音类型
 */
async function getSpeechData(
  input: string,
  language?: string,
  voice?: string
): Promise<YouDaoResponseType> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + '/speech/audio';
  const params = new URLSearchParams();

  params.append('input', input);
  if (language) params.append('language', language);
  if (voice) params.append('voice', voice);

  const response = await fetch(`${baseUrl}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * 播放单词发音
 * @param word 单词
 */
export async function playWordAudio(word: Word): Promise<void> {
  return new Promise(async resolve => {
    if (!word || !word.word?.trim()) {
      resolve();
      return;
    }

    try {
      const inputText = word.word;

      // 获取语音数据
      const speechData = await getSpeechData(
        inputText,
        word.language?.code,
        undefined
      );

      // 如果已有音频在播，先停止
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }

      // 创建新的音频实例
      currentAudio = new Audio(
        speechData?.tSpeakUrl || speechData?.speakUrl || ''
      );
      currentAudio.preload = 'auto';
      currentAudio.volume = 1;

      // 注册事件
      currentAudio.onended = () => {
        currentAudio = null;
        resolve();
      };

      currentAudio.onerror = error => {
        console.warn('Audio playback failed:', error);
        currentAudio = null;
        resolve();
      };

      currentAudio.onabort = () => {
        currentAudio = null;
        resolve();
      };

      // 开始播放
      try {
        await currentAudio.play();
      } catch (error) {
        console.warn('Audio play failed:', error);
        currentAudio = null;
        resolve();
      }
    } catch (error) {
      console.warn('Speech API error:', error);
      resolve();
    }
  });
}
