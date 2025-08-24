import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.interface';

@Injectable()
export class SpeechService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {}

  // 语言到默认语音的映射
  private readonly languageVoiceMap = {
    zh: 'zh-CN-XiaoxiaoNeural',
    'zh-CN': 'zh-CN-XiaoxiaoNeural',
    'zh-TW': 'zh-TW-HsiaoyuNeural',
    en: 'en-US-AvaNeural',
    'en-US': 'en-US-AvaNeural',
    'en-GB': 'en-GB-SoniaNeural',
    ja: 'ja-JP-NanamiNeural',
    'ja-JP': 'ja-JP-NanamiNeural',
    ko: 'ko-KR-SunHiNeural',
    'ko-KR': 'ko-KR-SunHiNeural',
    fr: 'fr-FR-DeniseNeural',
    'fr-FR': 'fr-FR-DeniseNeural',
    de: 'de-DE-KatjaNeural',
    'de-DE': 'de-DE-KatjaNeural',
    es: 'es-ES-ElviraNeural',
    'es-ES': 'es-ES-ElviraNeural',
    it: 'it-IT-ElsaNeural',
    'it-IT': 'it-IT-ElsaNeural',
    pt: 'pt-BR-FranciscaNeural',
    'pt-BR': 'pt-BR-FranciscaNeural',
    ru: 'ru-RU-SvetlanaNeural',
    'ru-RU': 'ru-RU-SvetlanaNeural',
    id: 'id-ID-ArdiNeural',
    'id-ID': 'id-ID-ArdiNeural',
    kz: 'kz-KZ-AigulNeural',
    'kz-KZ': 'kz-KZ-AigulNeural',
    tr: 'tr-TR-EmelNeural',
    'tr-TR': 'tr-TR-EmelNeural'
  };

  async getText2Speech(input: string, voice?: string, language?: string) {
    if (!input) {
      throw new Error('Input text is required');
    }

    // 如果没有指定 voice，根据 language 自动选择
    let selectedVoice = voice;
    if (!selectedVoice && language) {
      selectedVoice =
        this.languageVoiceMap[language] || this.languageVoiceMap['en-US'];
    }
    if (!selectedVoice) {
      selectedVoice = this.languageVoiceMap['en-US']; // 默认使用英语
    }

    try {
      // 调用 openai-edge-tts API
      const response = await firstValueFrom(
        this.httpService.post(
          this.configService.get('VOICE_API_URL') || '',
          {
            model: 'tts-1',
            input: input,
            voice: selectedVoice,
            response_format: 'mp3',
            speed: 0.8
          },
          {
            headers: {
              Authorization: 'Bearer your_api_key_here',
              'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
          }
        )
      );

      return {
        audio: Buffer.from(response.data),
        contentType: 'audio/mpeg',
        voice: selectedVoice,
        language: language
      };
    } catch (error) {
      throw new Error(`Text-to-speech conversion failed: ${error.message}`);
    }
  }
}
