import { Controller, Get, Query, Res, Header } from '@nestjs/common';
import type { Response } from 'express';
import { SpeechService } from './speech.service';

@Controller('speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}
  @Get('youdao-audio')
  @Header('Content-Type', 'audio/mpeg')
  async getYoudaoAudio(
    @Query('word') word: string,
    @Res() res: Response,
    @Query('type') type?: number
  ) {
    const audioBuffer = await this.speechService.getYoudaoAudio(word, type);
    res.send(audioBuffer);
  }
}
