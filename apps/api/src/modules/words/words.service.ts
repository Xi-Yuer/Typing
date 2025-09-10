import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './entities/word.entity';
import { GetUserWordsProgressDto } from './dto/get-user-words-progress.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginationResponseDto } from '../../common/dto/api-response.dto';
import { RedisService } from '../redis/redis.service';
import { JwtPayload } from '../auth/auth.service';

@Injectable()
export class WordsService {
  private readonly logger = new Logger(WordsService.name);
  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    private readonly redisService: RedisService
  ) {}

  /**
   * 创建单词
   */
  async create(createWordDto: CreateWordDto): Promise<Word> {
    // 检查同一语言和分类下是否已存在相同单词
    const existingWord = await this.wordRepository.findOne({
      where: {
        word: createWordDto.word,
        languageId: createWordDto.languageId,
        categoryId: createWordDto.categoryId
      }
    });

    if (existingWord) {
      throw new ConflictException(
        `单词 "${createWordDto.word}" 在该语言和分类下已存在`
      );
    }

    const word = this.wordRepository.create(createWordDto);
    return await this.wordRepository.save(word);
  }
  /**
   * 分页查询单词
   */
  async findAllPaginated(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<Word>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.wordRepository.findAndCount({
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 根据语言 ID 查询单词
   */
  async findByLanguageId(
    languageId: string,
    paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<Word>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.wordRepository.findAndCount({
      where: { languageId },
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 根据分类 ID 查询单词
   */
  async findByCategoryId(
    categoryId: string,
    paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<Word>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.wordRepository.findAndCount({
      where: { categoryId },
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 根据语言 ID 和分类 ID 查询单词
   */
  async findByLanguageAndCategory(
    paginationQuery: PaginationQueryDto,
    languageId?: string,
    categoryId?: string,
    user?: JwtPayload
  ): Promise<PaginationResponseDto<Word>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    // 构建查询条件，只添加非空的过滤条件
    const whereConditions: any = {};
    if (languageId) {
      whereConditions.languageId = languageId;
    }
    if (categoryId) {
      whereConditions.categoryId = categoryId;
    }

    const [list, total] = await this.wordRepository.findAndCount({
      where: whereConditions,
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize
    });

    if (user) {
      await this.redisService.setCache(
        `${user.id}:words:${languageId}:${categoryId}`,
        {
          page,
          pageSize
        }
      );
    }

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 搜索单词（支持单词原文和中文释义搜索）
   */
  async searchWords(
    keyword: string,
    paginationQuery: PaginationQueryDto,
    languageId?: string,
    categoryId?: string
  ): Promise<PaginationResponseDto<Word>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    if (!keyword || keyword.trim().length === 0) {
      throw new BadRequestException('搜索关键词不能为空');
    }

    const whereConditions: any = [
      { word: Like(`%${keyword}%`) },
      { meaning: Like(`%${keyword}%`) }
    ];

    // 如果指定了语言 ID，添加语言过滤条件
    if (languageId) {
      whereConditions.forEach((condition: any) => {
        condition.languageId = languageId;
      });
    }

    // 如果指定了分类 ID，添加分类过滤条件
    if (categoryId) {
      whereConditions.forEach((condition: any) => {
        condition.categoryId = categoryId;
      });
    }

    const [list, total] = await this.wordRepository.findAndCount({
      where: whereConditions,
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' }
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 分页搜索单词
   */
  async searchWordsPaginated(
    keyword: string,
    paginationQuery: PaginationQueryDto,
    languageId?: string,
    categoryId?: string
  ): Promise<PaginationResponseDto<Word>> {
    if (!keyword || keyword.trim().length === 0) {
      throw new BadRequestException('搜索关键词不能为空');
    }

    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const whereConditions: any = [
      { word: Like(`%${keyword}%`) },
      { meaning: Like(`%${keyword}%`) }
    ];

    // 如果指定了语言 ID，添加语言过滤条件
    if (languageId) {
      whereConditions.forEach((condition: any) => {
        condition.languageId = languageId;
      });
    }

    // 如果指定了分类 ID，添加分类过滤条件
    if (categoryId) {
      whereConditions.forEach((condition: any) => {
        condition.categoryId = categoryId;
      });
    }

    const [list, total] = await this.wordRepository.findAndCount({
      where: whereConditions,
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 根据 ID 查询单个单词
   */
  async findOne(id: string): Promise<Word> {
    const word = await this.wordRepository.findOne({
      where: { id },
      relations: ['language', 'category']
    });

    if (!word) {
      throw new NotFoundException(`ID 为 ${id} 的单词不存在`);
    }

    return word;
  }

  /**
   * 更新单词
   */
  async update(id: string, updateWordDto: UpdateWordDto): Promise<Word> {
    const word = await this.findOne(id);

    // 如果更新了单词内容，检查是否与其他单词冲突
    if (updateWordDto.word && updateWordDto.word !== word.word) {
      const existingWord = await this.wordRepository.findOne({
        where: {
          word: updateWordDto.word,
          languageId: updateWordDto.languageId || word.languageId,
          categoryId: updateWordDto.categoryId || word.categoryId
        }
      });

      if (existingWord && existingWord.id !== id) {
        throw new ConflictException(
          `单词 "${updateWordDto.word}" 在该语言和分类下已存在`
        );
      }
    }

    Object.assign(word, updateWordDto);
    return await this.wordRepository.save(word);
  }

  /**
   * 删除单词（软删除）
   */
  async remove(id: string): Promise<void> {
    await this.wordRepository.softDelete(id);
  }

  /**
   * 获取语言统计信息
   */
  async getLanguageStats(): Promise<any[]> {
    return await this.wordRepository
      .createQueryBuilder('word')
      .select('word.languageId', 'languageId')
      .addSelect('language.name', 'languageName')
      .addSelect('COUNT(word.id)', 'wordCount')
      .leftJoin('word.language', 'language')
      .groupBy('word.languageId')
      .addGroupBy('language.name')
      .orderBy('wordCount', 'DESC')
      .getRawMany();
  }

  /**
   * 获取分类统计信息
   */
  async getCategoryStats(): Promise<any[]> {
    return await this.wordRepository
      .createQueryBuilder('word')
      .select('word.categoryId', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(word.id)', 'wordCount')
      .leftJoin('word.category', 'category')
      .groupBy('word.categoryId')
      .addGroupBy('category.name')
      .orderBy('wordCount', 'DESC')
      .getRawMany();
  }

  /**
   * 随机获取单词（用于练习）
   */
  async getRandomWords(
    count: number = 10,
    languageId?: string,
    categoryId?: string
  ): Promise<Word[]> {
    if (count <= 0 || count > 100) {
      throw new BadRequestException('单词数量必须在 1-100 之间');
    }

    const queryBuilder = this.wordRepository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.language', 'language')
      .leftJoinAndSelect('word.category', 'category')
      .orderBy('RAND()')
      .limit(count);

    if (languageId) {
      queryBuilder.andWhere('word.languageId = :languageId', { languageId });
    }

    if (categoryId) {
      queryBuilder.andWhere('word.categoryId = :categoryId', { categoryId });
    }

    return await queryBuilder.getMany();
  }

  /**
   * 获取用户分页查询单词的进度,如果缓存不存在，则返回空对象
   */
  async getUserWordsProgress(
    languageId: string,
    categoryId: string,
    userId?: number
  ): Promise<GetUserWordsProgressDto> {
    console.log(userId);
    if (!userId) {
      return new GetUserWordsProgressDto({ userId });
    }
    try {
      const progress = await this.redisService.getCache(
        `${userId}:words:${languageId}:${categoryId}`
      );
      console.log('progress', progress);
      console.log(
        '`${userId}:words:${languageId}:${categoryId}`',
        `${userId}:words:${languageId}:${categoryId}`
      );

      return new GetUserWordsProgressDto(progress);
    } catch {
      return new GetUserWordsProgressDto({ userId });
    }
  }
}
