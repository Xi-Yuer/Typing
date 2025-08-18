import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorpusCategoriesService } from './corpus-categories.service';
import { CorpusCategoriesController } from './corpus-categories.controller';
import { CorpusCategory } from './entities/corpus-category.entity';
import { Language } from '../languages/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CorpusCategory, Language])],
  controllers: [CorpusCategoriesController],
  providers: [CorpusCategoriesService],
  exports: [CorpusCategoriesService]
})
export class CorpusCategoriesModule {}
