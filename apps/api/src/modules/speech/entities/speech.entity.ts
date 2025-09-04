import { ApiProperty } from '@nestjs/swagger';

export class Speech {
  /** 音频URL */
  @ApiProperty({ description: '音频URL' })
  audioUrl: string;
  /** 语音类型 */
  @ApiProperty({ description: '语音类型' })
  voice: string;
  /** 语言 */
  @ApiProperty({ description: '语言' })
  language: string;
  /** 翻译结果 */
  @ApiProperty({ description: '翻译结果' })
  translation: string;
  /** 翻译结果 */
  @ApiProperty({ description: '翻译结果' })
  /** 原始文本 */
  originalText: string;
  @ApiProperty({ description: '原始文本' })
  /** 有道API原始响应中的语音URL */
  tSpeakUrl?: string;
  @ApiProperty({ description: '有道API原始响应中的语音URL' })
  /** 有道API原始响应中的语音URL */
  speakUrl?: string;
}
