import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpeechService } from './speech.service';
import { SpeechController } from './speech.controller';
import { WordsModule } from '../words/words.module';

@Module({
  imports: [HttpModule, WordsModule],
  controllers: [SpeechController],
  providers: [SpeechService]
})
export class SpeechModule {}
