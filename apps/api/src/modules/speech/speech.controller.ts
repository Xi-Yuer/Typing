import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { SpeechService } from './speech.service';
import { ApiTags } from '@nestjs/swagger';
import type { YouDaoResponseType } from 'common';
import { ApiSuccessResponse } from '@/common/decorators/api-response.decorator';

@Controller('speech')
@ApiTags('语音')
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
  @ApiSuccessResponse<YouDaoResponseType>()
  async getText2Speech(
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
