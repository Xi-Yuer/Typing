import { useCallback, useEffect, useState, useRef } from 'react';
import Apis from '@/request';
import { isWord } from '@/utils';

/**
 * 检测音频数据格式并创建对应的 Blob
 * @param audioData ArrayBuffer 音频数据
 * @returns Blob 对象
 */
function createAudioBlob(audioData: ArrayBuffer): Blob {
  const uint8Array = new Uint8Array(audioData);

  // 检测文件头来判断音频格式
  const header = Array.from(uint8Array.slice(0, 12))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  // MP3 文件通常以 ID3 标签开头 (49 44 33) 或者直接是 MP3 帧 (ff fb/ff fa)
  if (
    header.startsWith('494433') ||
    header.startsWith('fffb') ||
    header.startsWith('fffa')
  ) {
    return new Blob([audioData], { type: 'audio/mpeg' });
  }

  // WAV 文件头 (52 49 46 46)
  if (header.startsWith('52494646')) {
    return new Blob([audioData], { type: 'audio/wav' });
  }

  // OGG 文件头 (4f 67 67 53)
  if (header.startsWith('4f676753')) {
    return new Blob([audioData], { type: 'audio/ogg' });
  }

  // M4A/AAC 文件头 (通常包含 ftyp)
  if (header.includes('66747970')) {
    return new Blob([audioData], { type: 'audio/mp4' });
  }

  // 默认尝试多种格式
  return new Blob([audioData], { type: 'audio/mpeg' });
}

export type UseSpeechResult = {
  /**
   * Speak speaking
   * @param {boolean} [abort=false] Whether to cancel other speak
   */
  speak: (abort?: boolean) => void;
  /**
   * Cancel speaking
   */
  cancel: () => void;
  /**
   * Whether currently speaking
   */
  speaking: boolean;
  /**
   * Whether currently loading audio
   */
  loading: boolean;
  /**
   * Error message if any
   */
  error: string | null;
  /**
   * Whether using API speech (true) or native speech (false)
   */
  usingApiSpeech: boolean;
};

/**
 * React hook for using the SpeechSynthesis API.
 * @param {string} text The words to be spoken.
 * @param {Partial<SpeechSynthesisUtterance>} option SpeechSynthesisUtterance API option. {@link https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance#instance_properties}
 * @returns {Object} An object containing `speak`, `cancel` methods and `speaking` state.
 * @throws {Error} If browser not support SpeechSynthesis API.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API}
 */
export default function useSpeech(
  text: string,
  option?: Partial<SpeechSynthesisUtterance>
): UseSpeechResult {
  const words = text
    .split(' ')
    .filter(item => isWord(item))
    .join(' ');
  const [nativeSpeaking, setNativeSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );
  const [usingApiSpeech, setUsingApiSpeech] = useState(true);

  // 原生语音播放函数
  const nativeSpeak = useCallback(
    (abort = false) => {
      const synth = window.speechSynthesis;
      if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
        return;
      }

      if (abort && synth.speaking) {
        synth.cancel();
      }

      // 创建新的 utterance 或使用现有的
      const currentUtterance = utterance || new SpeechSynthesisUtterance(words);
      if (!utterance) {
        Object.assign(currentUtterance, option);
      }

      const onend = () => {
        setNativeSpeaking(false);
      };

      currentUtterance.addEventListener('end', onend);
      setNativeSpeaking(true);
      synth.speak(currentUtterance);
    },
    [utterance, words, option]
  );

  const {
    speak: apiSpeak,
    error: apiError,
    loading: apiLoading,
    speaking: apiSpeaking,
    cancel: apiCancel
  } = useApiSpeech(words, 1, nativeSpeak);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
      return;
    }

    const newUtterance = new SpeechSynthesisUtterance(words);
    Object.assign(newUtterance, option);
    setUtterance(newUtterance);

    return () => {
      synth.cancel();
      setNativeSpeaking(false);
    };
  }, [option, words]);

  useEffect(() => {
    if (utterance) {
      const onend = () => {
        setNativeSpeaking(false);
      };
      utterance.addEventListener('end', onend);
      return () => {
        utterance.removeEventListener('end', onend);
      };
    }
  }, [utterance]);

  // 监听 API 错误状态，决定是否回退到原生语音
  useEffect(() => {
    if (apiError) {
      setUsingApiSpeech(false);
    } else {
      setUsingApiSpeech(true);
    }
  }, [apiError]);

  const speak = useCallback(
    (abort = false) => {
      // 始终优先尝试 API 语音
      apiSpeak(abort);
    },
    [apiSpeak]
  );

  const cancel = useCallback(() => {
    // 取消 API 语音播放
    if (apiSpeaking || apiLoading) {
      apiCancel();
    }

    // 取消原生语音播放
    const synth = window.speechSynthesis;
    if (nativeSpeaking || synth.speaking) {
      synth.cancel();
      setNativeSpeaking(false);
    }
  }, [apiSpeaking, apiLoading, apiCancel, nativeSpeaking]);

  // 计算综合状态
  const speaking = usingApiSpeech ? apiSpeaking : nativeSpeaking;
  const loading = usingApiSpeech ? apiLoading : false;
  const error = usingApiSpeech ? apiError : null;

  return {
    speak,
    cancel,
    speaking,
    loading,
    error,
    usingApiSpeech
  };
}

/**
 * API 版本的语音播放 Hook
 * 使用有道 API 获取音频数据并播放
 */
export type UseApiSpeechResult = {
  /**
   * 播放语音
   * @param {boolean} [abort=false] 是否中断当前播放
   */
  speak: (abort?: boolean) => Promise<void>;
  /**
   * 取消播放
   */
  cancel: () => void;
  /**
   * 是否正在播放
   */
  speaking: boolean;
  /**
   * 是否正在加载音频
   */
  loading: boolean;
  /**
   * 错误信息
   */
  error: string | null;
};

/**
 * 使用 API 请求获取音频并播放的 Hook
 * @param {string} words 要播放的文本
 * @param {number} [type=1] 音频类型，默认为 1
 * @returns {UseApiSpeechResult} 包含播放控制方法和状态的对象
 */
export function useApiSpeech(
  words: string,
  type: number = 1,
  fallbackSpeak: (abort?: boolean) => void
): UseApiSpeechResult {
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // 清理音频资源
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('ended', handleAudioEnd);
      audioRef.current.removeEventListener('error', handleAudioError);
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  // 音频播放结束处理
  const handleAudioEnd = useCallback(() => {
    setSpeaking(false);
    cleanupAudio();
  }, [cleanupAudio]);

  // 音频错误处理
  const handleAudioError = useCallback(
    (event: Event) => {
      setError('音频播放失败');
      setSpeaking(false);
      cleanupAudio();
    },
    [cleanupAudio]
  );

  // 尝试播放音频的辅助函数
  const tryPlayAudio = useCallback(
    async (audioData: ArrayBuffer) => {
      // 使用智能格式检测
      const audioBlob = createAudioBlob(audioData);
      const audioUrl = URL.createObjectURL(audioBlob);

      // 清理之前的 URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      audioUrlRef.current = audioUrl;

      // 创建音频元素
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // 绑定事件监听器
      audio.addEventListener('ended', handleAudioEnd);
      audio.addEventListener('error', handleAudioError);

      try {
        // 播放音频
        setSpeaking(true);
        await audio.play();
      } catch (playError) {
        // 清理失败的音频资源
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleAudioEnd);
          audioRef.current.removeEventListener('error', handleAudioError);
          audioRef.current = null;
        }
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
        setSpeaking(false);
        const errorMessage =
          playError instanceof Error ? playError.message : String(playError);
        throw new Error(`音频播放失败: ${errorMessage}`);
      }
    },
    [handleAudioEnd, handleAudioError]
  );

  // 播放语音
  const speak = useCallback(
    async (abort = false) => {
      try {
        setError(null);

        // 如果需要中断当前播放
        if (abort && speaking) cancel();

        // 如果已经在播放且不需要中断，直接返回
        if (speaking && !abort) return;

        // 如果正在加载，不重复请求
        if (loading) return;

        setLoading(true);
        // 请求音频数据
        const response = await Apis.Speech.SpeechController_getYoudaoAudio({
          params: {
            word: words,
            type: type
          },
          cacheFor: {
            expire: 0
          }
        });

        // 检查响应是否为 ArrayBuffer
        if (!response || !((response as any) instanceof ArrayBuffer)) {
          throw new Error('Invalid audio response format');
        }

        const audioData = response as ArrayBuffer;

        // 尝试播放音频，如果失败则尝试不同的格式
        try {
          await tryPlayAudio(audioData);
        } catch (audioErr) {
          // 音频播放失败，立即降级到原生语音
          fallbackSpeak(abort);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'API 请求失败');
        // API 请求失败，降级到原生语音
        try {
          fallbackSpeak(abort);
        } catch (fallbackErr) {
          setError('语音播放完全失败');
        }
      } finally {
        setLoading(false);
      }
    },
    [
      words,
      type,
      speaking,
      loading,
      handleAudioEnd,
      handleAudioError,
      cleanupAudio
    ]
  );

  // 取消播放
  const cancel = useCallback(() => {
    if (speaking || loading) {
      setSpeaking(false);
      setLoading(false);
      cleanupAudio();
    }
  }, [speaking, loading, cleanupAudio]);

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    speak,
    cancel,
    speaking,
    loading,
    error
  };
}
