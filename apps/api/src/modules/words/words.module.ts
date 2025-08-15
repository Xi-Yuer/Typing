import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { Word } from './entities/word.entity';
import { Language } from '../languages/entities/language.entity';
import { CorpusCategory } from '../corpus-categories/entities/corpus-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word, Language, CorpusCategory]),
  ],
  controllers: [WordsController],
  providers: [WordsService],
  exports: [WordsService],
})
export class WordsModule {}
