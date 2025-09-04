import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.interface';
import { YouDaoResponseType } from 'common';
import * as crypto from 'crypto';
import { WordsService } from '../words/words.service';

@Injectable()
export class SpeechService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly wordsService: WordsService
  ) {}

  /**
   * 生成有道TTS API签名
   * @param appKey 应用ID
   * @param appSecret 应用密钥
   * @param query 查询文本
   * @param salt 随机数
   * @param curtime 时间戳
   * @returns 签名字符串
   */
  private generateSign(
    appKey: string,
    appSecret: string,
    query: string,
    salt: string,
    curtime: string
  ): string {
    const word = this.truncate(query);
    const signStr = appKey + word + salt + curtime + appSecret;
    return crypto.createHash('sha256').update(signStr).digest('hex');
  }

  /**
   * 截断字符串（有道API要求）
   * @param query 原始字符串
   * @returns 截断后的字符串
   */
  private truncate(query: string): string {
    const len = query.length;
    if (len <= 20) {
      return query;
    }
    return query.substring(0, 10) + len + query.substring(len - 10, len);
  }

  /**
   * 文本转语音服务
   * 先调用有道翻译API获取翻译结果和语音URL，然后获取音频数据
   * @param id 单词ID
   * @param word 输入文本
   * @param voice 语音类型（可选）
   * @param form 语言（可选）
   * @returns 音频数据和相关信息
   */
  async getText2Speech(
    id: string,
    word: string,
    form: string,
    voice: string
  ): Promise<YouDaoResponseType> {
    if (!word) {
      throw new Error('Input text is required');
    }

    // 获取有道API配置
    const appKey = this.configService.get('YOUDAO_APP_KEY');
    const appSecret = this.configService.get('YOUDAO_APP_SECRET');

    if (!appKey || !appSecret) {
      throw new Error('Youdao API credentials are not configured');
    }

    // 生成请求参数
    const salt = crypto.randomUUID();
    const curtime = Math.round(new Date().getTime() / 1000).toString();
    const sign = this.generateSign(appKey, appSecret, word, salt, curtime);

    try {
      // 调用有道翻译API
      const params = new URLSearchParams({
        q: word,
        from: form,
        to: 'zh-CN',
        appKey: appKey,
        voice: voice,
        salt: salt,
        sign: sign,
        signType: 'v3',
        curtime: curtime
      });

      const response = await firstValueFrom(
        this.httpService.get(
          `https://openapi.youdao.com/api?${params.toString()}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
      );
      this.wordsService.update(id, {
        meaningShort: response.data.translation.join(',')
      });
      const data = response.data;

      // 检查API响应
      if (data.errorCode && data.errorCode !== '0') {
        throw new Error(`Youdao API error: ${data.errorCode}`);
      }
      // 返回处理后的数据
      return data;
    } catch (error) {
      throw new Error(`Youdao API error: ${error}`);
    }
  }
}
