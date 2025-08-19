import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class SpeechService {
  constructor(private readonly httpService: HttpService) {}
  // 获取有道词典音频数据
  async getYoudaoAudio(word: string, type: number = 1): Promise<Buffer> {
    console.log('请求参数:', { word, type });
    try {
      const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}`;
      const response: AxiosResponse<ArrayBuffer> = await firstValueFrom(
        this.httpService.get(audioUrl, {
          responseType: 'arraybuffer',
          timeout: 10000, // 10秒超时
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            Accept: 'audio/mpeg, audio/*',
            Referer: 'https://dict.youdao.com/'
          }
        })
      );
      console.log('响应状态:', response);
      return Buffer.from(response.data);
    } catch (error) {
      console.error('获取有道音频失败:', error.message || error);
      throw new HttpException(
        `获取音频失败: ${error.message || '未知错误'}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
