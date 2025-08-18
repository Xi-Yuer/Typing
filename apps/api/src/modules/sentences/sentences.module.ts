import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentencesService } from './sentences.service';
import { SentencesController } from './sentences.controller';
import { Sentence } from './entities/sentence.entity';
import { Language } from '../languages/entities/language.entity';
import { CorpusCategory } from '../corpus-categories/entities/corpus-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sentence, Language, CorpusCategory])],
  controllers: [SentencesController],
  providers: [SentencesService],
  exports: [SentencesService]
})
export class SentencesModule {}
