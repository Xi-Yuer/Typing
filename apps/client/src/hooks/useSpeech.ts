import { Word } from '@/request/globals';

/**
 * 生成语音 API URL
 * @param input 要转换的文本
 * @param language 语言代码
 * @param voice 可选的语音类型
 * @returns 语音 API URL
 */
function generateSpeechApiUrl(
  input: string,
  language?: string,
  voice?: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + '/speech/audio';
  const params = new URLSearchParams();

  params.append('input', input);

  if (language) {
    params.append('language', language);
  }

  if (voice) {
    params.append('voice', voice);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * 播放单词发音
 * @param word 单词
 * @param phrase 可选的短语
 * @returns Promise<void>
 */

let isPlaying = false;

export async function playWordAudio(word: Word): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查参数有效性
    if (!word || !word.word || !word.word.trim()) {
      resolve();
      return;
    }

    // 使用 phrase 或 word.word 作为输入文本
    const inputText = word.word;

    // 生成语音 API URL
    const audioUrl = generateSpeechApiUrl(
      inputText,
      word.language?.code,
      undefined // 让后端根据 language 自动选择 voice
    );

    // 创建音频元素
    const audio = new Audio(audioUrl);

    // 设置音频属性
    audio.preload = 'auto';
    audio.volume = 1;

    // 监听事件
    audio.onloadstart = () => {};

    audio.oncanplay = () => {};

    audio.onplay = () => {
      isPlaying = true;
    };

    audio.onended = () => {
      isPlaying = false;
      resolve();
    };

    audio.onerror = error => {
      console.warn('Audio playback failed:', error);
      resolve(); // 即使失败也 resolve，避免阻塞用户操作
    };

    audio.onabort = () => {
      isPlaying = false;
      resolve();
    };

    // 开始播放
    try {
      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        return;
      }
      audio.play().catch(error => {
        console.warn('Audio play failed:', error);
        resolve();
      });
    } catch (error) {
      console.warn('Audio play error:', error);
      resolve();
    }
  });
}
