import { Controller, Get, Query, Res, Header } from '@nestjs/common';
import type { Response } from 'express';
import { SpeechService } from './speech.service';
import { CacheTTL } from '@nestjs/cache-manager';
import * as crypto from 'crypto';
import { NoCache } from '@/common/decorators/no-cache.decorator';

@Controller('speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}
  @Get('audio')
  @NoCache()
  @Header('Content-Type', 'audio/mpeg')
  async getYoudaoAudio(
    @Query('word') word: string,
    @Res() res: Response,
    @Query('type') type?: number
  ) {
    const audioBuffer = await this.speechService.getYoudaoAudio(word, type);

    // 生成 ETag 用于缓存验证
    const etag = crypto
      .createHash('md5')
      .update(`${word}-${type || 1}`)
      .digest('hex');

    // 设置缓存相关的响应头
    res.set({
      'Cache-Control': 'public, max-age=86400', // 缓存24小时
      ETag: `"${etag}"`,
      'Last-Modified': new Date().toUTCString(),
      Expires: new Date(Date.now() + 86400000).toUTCString() // 24小时后过期
    });

    // 检查客户端是否有缓存
    const clientETag = res.req.headers['if-none-match'];
    if (clientETag === `"${etag}"`) {
      return res.status(304).end(); // 返回 304 Not Modified
    }

    res.send(audioBuffer);
  }
}
