import { Word } from '@/request/globals';
import { YouDaoResponseType } from 'common';
import Apis from '@/request';
let currentAudio: HTMLAudioElement | null = null;

/**
 * 获取语音数据
 * @param word 要转换的文本
 * @param language 语言代码
 * @param voice 可选的语音类型
 */
async function getSpeechData(
  word: Word,
  voice?: string
): Promise<YouDaoResponseType> {
  const response = await Apis.general.SpeechController_getText2Speech({
    params: {
      id: word.id,
      word: word.word,
      form: word.language?.code,
      voice: voice || '0'
    }
  });
  return response.data;
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
      // 获取语音数据
      const speechData = await getSpeechData(word, '0');

      // 如果已有音频在播，先停止
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }

      // 创建新的音频实例
      currentAudio = new Audio(speechData?.speakUrl);
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
