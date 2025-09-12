import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordErrorRecordsService } from './word-error-records.service';
import { WordErrorRecordsController } from './word-error-records.controller';
import { WordErrorRecord } from './entities/word-error-record.entity';
import { Word } from '../words/entities/word.entity';
import { CorpusCategory } from '../corpus-categories/entities/corpus-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordErrorRecord, Word, CorpusCategory])],
  controllers: [WordErrorRecordsController],
  providers: [WordErrorRecordsService],
  exports: [WordErrorRecordsService]
})
export class WordErrorRecordsModule {}
