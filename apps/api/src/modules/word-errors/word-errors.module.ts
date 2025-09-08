import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordErrorReportsService } from './word-error-reports.service';
import { WordErrorReportsController } from './word-error-reports.controller';
import { WordErrorReport } from './entities/word-error.entity';
import { User } from '../user/entities/user.entity';
import { Word } from '../words/entities/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordErrorReport, User, Word])],
  controllers: [WordErrorReportsController],
  providers: [WordErrorReportsService],
  exports: [WordErrorReportsService]
})
export class WordErrorReportsModule {}
