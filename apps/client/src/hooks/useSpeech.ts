import { Word } from '@/request/globals';

// 语音类型定义
export type PronunciationType =
  | 'us'
  | 'uk'
  | 'zh'
  | 'ja'
  | 'de'
  | 'id'
  | 'kk'
  | 'hapin'
  | 'romaji'
  | false;

// 有道词典API
const pronunciationApi = 'https://dict.youdao.com/dictvoice?audio=';

/**
 * 生成单词发音URL
 * @param word 单词
 * @param pronunciation 发音类型
 * @returns 音频URL
 */
export function generateWordSoundSrc(
  word: string,
  pronunciation: string,
  phrase?: string
): string {
  const encodedWord = encodeURIComponent(word);
  switch (pronunciation) {
    case 'en':
      return `${pronunciationApi}${encodedWord}&type=${phrase}`;
    case 'zh':
      return `${pronunciationApi}${encodedWord}&le=zh`;
    case 'ja':
      return `${pronunciationApi}${encodedWord}&le=jap`;
    case 'de':
      return `${pronunciationApi}${encodedWord}&le=de`;
    case 'id':
      return `${pronunciationApi}${encodedWord}&le=id`;
    case 'kk':
      return `${pronunciationApi}${encodedWord}&le=kk`;
    case 'hapin':
      return `${pronunciationApi}${encodedWord}&le=hapin`;
    case 'romaji':
      return `${pronunciationApi}${encodedWord}&le=romaji`;
    default:
      return `${pronunciationApi}${encodedWord}&type=1`;
  }
}

/**
 * 播放单词发音
 * @param word 单词
 * @param pronunciation 发音类型，默认为'us'
 * @returns Promise<void>
 */
export async function playWordAudio(
  word: Word,
  phrase?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查参数有效性
    if (!word || !word.word || !word.word.trim() || !word.language.code) {
      resolve();
      return;
    }

    const audioUrl = generateWordSoundSrc(
      word.word,
      word.language.code,
      phrase
    );
    // 创建音频元素
    const audio = new Audio(audioUrl);

    // 设置音频属性
    audio.preload = 'auto';
    audio.volume = 1;

    // 监听事件
    audio.onloadstart = () => {};

    audio.oncanplay = () => {};

    audio.onplay = () => {};

    audio.onended = () => resolve();

    audio.onerror = error => {};

    audio.onabort = () => resolve();

    // 开始播放
    try {
      audio.play();
    } catch (error) {}
  });
}
