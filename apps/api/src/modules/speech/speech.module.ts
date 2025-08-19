import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpeechService } from './speech.service';
import { SpeechController } from './speech.controller';

@Module({
  imports: [HttpModule],
  controllers: [SpeechController],
  providers: [SpeechService]
})
export class SpeechModule {}
