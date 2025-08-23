import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import type { Response } from 'express';
import { SpeechService } from './speech.service';
import { NoCache } from '@/common/decorators/no-cache.decorator';

@Controller('speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Get('audio')
  @NoCache()
  async getText2Speech(
    @Res() res: Response,
    @Query('input') input?: string,
    @Query('voice') voice?: string,
    @Query('language') language?: string
  ) {
    try {
      if (!input) {
        throw new HttpException(
          'Input parameter is required',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.speechService.getText2Speech(
        input,
        voice,
        language
      );

      // 设置响应头
      res.set({
        'Content-Type': result.contentType,
        'Content-Disposition': 'inline; filename="speech.mp3"',
        'Cache-Control': 'no-cache',
        'X-Voice-Used': result.voice,
        'X-Language': result.language || 'auto'
      });

      // 发送音频数据
      res.send(result.audio);
    } catch (error) {
      throw new HttpException(
        error.message || 'Text-to-speech conversion failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
