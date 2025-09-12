import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordErrorRecord } from './entities/word-error-record.entity';
import { Word } from '../words/entities/word.entity';
import { CorpusCategory } from '../corpus-categories/entities/corpus-category.entity';
import { CreateWordErrorRecordDto } from './dto/create-word-error-record.dto';
import { QueryWordErrorRecordDto } from './dto/query-word-error-record.dto';
import {
  WordErrorRecordResponseDto,
  WordErrorRecordListResponseDto
} from './dto/word-error-record-response.dto';

@Injectable()
export class WordErrorRecordsService {
  constructor(
    @InjectRepository(WordErrorRecord)
    private wordErrorRecordRepository: Repository<WordErrorRecord>,
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
    @InjectRepository(CorpusCategory)
    private categoryRepository: Repository<CorpusCategory>
  ) {}

  /**
   * 记录单词错误
   */
  async recordWordError(
    createWordErrorRecordDto: CreateWordErrorRecordDto,
    userId: string
  ): Promise<WordErrorRecordResponseDto> {
    // 验证单词是否存在
    const word = await this.wordRepository.findOne({
      where: { id: createWordErrorRecordDto.wordId }
    });
    if (!word) {
      throw new NotFoundException('单词不存在');
    }

    // 验证分类是否存在
    const category = await this.categoryRepository.findOne({
      where: { id: createWordErrorRecordDto.categoryId }
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    // 检查是否已存在该用户的错词记录
    const existingRecord = await this.wordErrorRecordRepository.findOne({
      where: {
        userId,
        wordId: createWordErrorRecordDto.wordId
      }
    });

    if (existingRecord) {
      // 更新现有记录
      existingRecord.errorCount += 1;
      existingRecord.lastErrorTime = new Date();
      existingRecord.updatedAt = new Date();

      const updatedRecord =
        await this.wordErrorRecordRepository.save(existingRecord);
      return new WordErrorRecordResponseDto(updatedRecord);
    } else {
      // 创建新记录
      const now = new Date();
      const wordErrorRecord = this.wordErrorRecordRepository.create({
        ...createWordErrorRecordDto,
        userId,
        errorCount: 1,
        lastErrorTime: now,
        firstErrorTime: now,
        isPracticed: false,
        practiceCount: 0
      });

      const savedRecord =
        await this.wordErrorRecordRepository.save(wordErrorRecord);
      return new WordErrorRecordResponseDto(savedRecord);
    }
  }

  /**
   * 获取用户的错词记录列表
   */
  async getUserErrorRecords(
    userId: string,
    queryDto: QueryWordErrorRecordDto
  ): Promise<WordErrorRecordListResponseDto> {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'lastErrorTime',
      sortOrder = 'DESC',
      ...filters
    } = queryDto;

    const queryBuilder = this.wordErrorRecordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.word', 'word')
      .leftJoinAndSelect('record.category', 'category')
      .where('record.userId = :userId', { userId });

    // 应用过滤条件
    if (filters.categoryId) {
      queryBuilder.andWhere('record.categoryId = :categoryId', {
        categoryId: filters.categoryId
      });
    }
    if (filters.languageId) {
      queryBuilder.andWhere('record.languageId = :languageId', {
        languageId: filters.languageId
      });
    }
    if (filters.isPracticed !== undefined) {
      queryBuilder.andWhere('record.isPracticed = :isPracticed', {
        isPracticed: filters.isPracticed
      });
    }

    // 排序
    queryBuilder.orderBy(`record.${sortBy}`, sortOrder);

    // 分页
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [records, total] = await queryBuilder.getManyAndCount();

    const list = records.map(record => new WordErrorRecordResponseDto(record));
    const totalPages = Math.ceil(total / pageSize);

    return {
      list,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  /**
   * 获取用户有错词的分类列表
   */
  async getCategoriesWithErrors(userId: string): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      categoryDescription: string;
      difficulty: number;
      languageId: string;
      languageName: string;
      errorCount: number;
      wordCount: number;
      unPracticedCount: number;
    }>
  > {
    const categoriesWithErrors = await this.wordErrorRecordRepository
      .createQueryBuilder('record')
      .leftJoin('record.category', 'category')
      .leftJoin('category.language', 'language')
      .select([
        'record.categoryId as categoryId',
        'category.name as categoryName',
        'category.description as categoryDescription',
        'category.difficulty as difficulty',
        'record.languageId as languageId',
        'language.name as languageName',
        'SUM(record.errorCount) as errorCount',
        'COUNT(DISTINCT record.wordId) as wordCount',
        'SUM(CASE WHEN record.isPracticed = false THEN 1 ELSE 0 END) as unPracticedCount'
      ])
      .where('record.userId = :userId', { userId })
      .groupBy(
        'record.categoryId, category.name, category.description, category.difficulty, record.languageId, language.name'
      )
      .orderBy('errorCount', 'DESC')
      .getRawMany();

    return categoriesWithErrors.map(cat => ({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      categoryDescription: cat.categoryDescription,
      difficulty: parseInt(cat.difficulty),
      languageId: cat.languageId,
      languageName: cat.languageName,
      errorCount: parseInt(cat.errorCount),
      wordCount: parseInt(cat.wordCount),
      unPracticedCount: parseInt(cat.unPracticedCount)
    }));
  }

  /**
   * 按分类获取错词记录
   */
  async getErrorRecordsByCategory(
    userId: string,
    categoryId: string,
    queryDto?: Partial<QueryWordErrorRecordDto>
  ): Promise<WordErrorRecordListResponseDto> {
    const queryWithCategory = {
      ...queryDto,
      categoryId
    };
    return this.getUserErrorRecords(
      userId,
      queryWithCategory as QueryWordErrorRecordDto
    );
  }

  /**
   * 获取未练习的错词记录（用于练习模式）
   */
  async getUnPracticedErrorRecords(
    userId: string,
    categoryId?: string,
    limit: number = 20
  ): Promise<WordErrorRecordResponseDto[]> {
    const queryBuilder = this.wordErrorRecordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.word', 'word')
      .leftJoinAndSelect('record.category', 'category')
      .where('record.userId = :userId', { userId })
      .andWhere('record.isPracticed = :isPracticed', { isPracticed: false });

    if (categoryId) {
      queryBuilder.andWhere('record.categoryId = :categoryId', { categoryId });
    }

    queryBuilder
      .orderBy('record.errorCount', 'DESC')
      .addOrderBy('record.lastErrorTime', 'DESC')
      .limit(limit);

    const records = await queryBuilder.getMany();
    return records.map(record => new WordErrorRecordResponseDto(record));
  }

  /**
   * 获取错词统计信息
   */
  async getErrorStatistics(userId: string): Promise<{
    totalErrors: number;
    categoryStats: Array<{
      categoryId: string;
      categoryName: string;
      errorCount: number;
      wordCount: number;
    }>;
    languageStats: Array<{
      languageId: string;
      languageName: string;
      errorCount: number;
      wordCount: number;
    }>;
  }> {
    // 获取总错误数
    const totalErrors = await this.wordErrorRecordRepository
      .createQueryBuilder('record')
      .select('SUM(record.errorCount)', 'total')
      .where('record.userId = :userId', { userId })
      .getRawOne();

    // 按分类统计
    const categoryStats = await this.wordErrorRecordRepository
      .createQueryBuilder('record')
      .leftJoin('record.category', 'category')
      .select([
        'record.categoryId as categoryId',
        'category.name as categoryName',
        'SUM(record.errorCount) as errorCount',
        'COUNT(DISTINCT record.wordId) as wordCount'
      ])
      .where('record.userId = :userId', { userId })
      .groupBy('record.categoryId, category.name')
      .getRawMany();

    // 按语言统计
    const languageStats = await this.wordErrorRecordRepository
      .createQueryBuilder('record')
      .leftJoin('record.word', 'word')
      .leftJoin('word.language', 'language')
      .select([
        'record.languageId as languageId',
        'language.name as languageName',
        'SUM(record.errorCount) as errorCount',
        'COUNT(DISTINCT record.wordId) as wordCount'
      ])
      .where('record.userId = :userId', { userId })
      .groupBy('record.languageId, language.name')
      .getRawMany();

    return {
      totalErrors: parseInt(totalErrors.total) || 0,
      categoryStats: categoryStats.map(stat => ({
        categoryId: stat.categoryId,
        categoryName: stat.categoryName,
        errorCount: parseInt(stat.errorCount),
        wordCount: parseInt(stat.wordCount)
      })),
      languageStats: languageStats.map(stat => ({
        languageId: stat.languageId,
        languageName: stat.languageName,
        errorCount: parseInt(stat.errorCount),
        wordCount: parseInt(stat.wordCount)
      }))
    };
  }

  /**
   * 标记错词为已练习
   */
  async markAsPracticed(
    userId: string,
    wordId: string
  ): Promise<WordErrorRecordResponseDto> {
    const record = await this.wordErrorRecordRepository.findOne({
      where: { userId, wordId },
      relations: ['word', 'category']
    });

    if (!record) {
      throw new NotFoundException('错词记录不存在');
    }

    record.isPracticed = true;
    record.practiceCount += 1;
    record.lastPracticeTime = new Date();
    record.updatedAt = new Date();

    const updatedRecord = await this.wordErrorRecordRepository.save(record);
    return new WordErrorRecordResponseDto(updatedRecord);
  }

  /**
   * 删除错词记录
   */
  async remove(userId: string, wordId: string): Promise<void> {
    const result = await this.wordErrorRecordRepository.delete({
      userId,
      wordId
    });

    if (result.affected === 0) {
      throw new NotFoundException('错词记录不存在');
    }
  }

  /**
   * 批量删除错词记录
   */
  async removeBatch(userId: string, wordIds: string[]): Promise<void> {
    if (wordIds.length === 0) {
      throw new BadRequestException('请提供要删除的单词ID列表');
    }

    await this.wordErrorRecordRepository.delete({
      userId,
      wordId: wordIds.length === 1 ? wordIds[0] : undefined
    });
  }

  /**
   * 获取单个错词记录详情
   */
  async findOne(
    userId: string,
    wordId: string
  ): Promise<WordErrorRecordResponseDto> {
    const record = await this.wordErrorRecordRepository.findOne({
      where: { userId, wordId },
      relations: ['word', 'category']
    });

    if (!record) {
      throw new NotFoundException('错词记录不存在');
    }

    return new WordErrorRecordResponseDto(record);
  }
}
