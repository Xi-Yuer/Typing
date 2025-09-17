import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { SpeechService } from './speech.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@/common/decorators/api-response.decorator';
import { Speech } from './entities/speech.entity';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('speech')
@ApiTags('语音')
@CacheTTL(24 * 60 * 60 * 1000) // 24小时
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  /**
   * 文本转语音接口
   * 返回包装好的JSON数据，包含语音URL和相关信息
   * @param input 输入文本
   * @param voice 语音类型（可选）
   * @param language 语言（可选）
   * @returns JSON格式的响应数据
   */
  @Get('audio')
  @ApiSuccessResponse(Speech, {
    description: '语音数据'
  })
  async getText2Speech(
    @Query('id') id: string,
    @Query('word') input: string,
    @Query('form') language: string,
    @Query('voice') voice: string
  ) {
    try {
      if (!input) {
        throw new HttpException(
          'Input parameter is required',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.speechService.getText2Speech(
        id,
        input,
        language,
        voice
      );
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Text-to-speech conversion failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
