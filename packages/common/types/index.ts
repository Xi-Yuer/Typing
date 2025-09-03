export interface YouDaoResponseType {
  /** 音频URL */
  audioUrl: string;
  /** 语音类型 */
  voice: string;
  /** 语言 */
  language: string;
  /** 翻译结果 */
  translation: string;
  /** 原始文本 */
  originalText: string;
  /** 有道API原始响应中的语音URL */
  tSpeakUrl?: string;
  /** 有道API原始响应中的语音URL */
  speakUrl?: string;
}

export interface MTerminalDict {
  url: string;
}

export interface Dict {
  url: string;
}

export interface Webdict {
  url: string;
}
