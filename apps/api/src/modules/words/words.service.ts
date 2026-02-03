import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException
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
import { RankingResponseDto, RankingItemDto } from './dto/ranking.dto';
import { UserService } from '../user/user.service';
import { CreateCorrectDto } from './dto/create-correct-dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    private readonly redisService: RedisService,
    private readonly userService: UserService
  ) { }

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
      await this.redisService.setPermanentCache(
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
    if (!userId) {
      return new GetUserWordsProgressDto({});
    }
    try {
      const progress = await this.redisService.getCache(
        `${userId}:words:${languageId}:${categoryId}`
      );
      return new GetUserWordsProgressDto({ ...progress, userId });
    } catch {
      return new GetUserWordsProgressDto({ userId });
    }
  }
  /**
   * 单词正确记录
   */
  async correctWord(correctWordDto: CreateCorrectDto, userId?: number) {
    const word = await this.wordRepository.findOne({
      where: { id: correctWordDto.id }
    });
    if (!word) {
      throw new NotFoundException('单词不存在');
    }

    // 如果没有用户ID，直接返回成功但不记录分数
    if (!userId) {
      return 'no_user';
    }

    // 检查用户是否已经正确输入过这个单词
    const userWordKey = `user:${userId}:correct:${correctWordDto.id}`;
    const alreadyCorrect = await this.redisService.exists(userWordKey);

    if (alreadyCorrect) {
      // 如果已经正确输入过，返回提示信息
      return 'already_correct';
    }

    // 记录用户已正确输入此单词
    await this.redisService.setPermanentCache(userWordKey, {
      wordId: correctWordDto.id,
      userId: userId,
      correctTime: new Date().toISOString()
    });

    // 更新排行榜分数
    await this.redisService.zincrby(`rank:total`, 1, `user:${userId}`);
    // 日榜：24小时过期（86400秒）
    await this.redisService.zincrbyWithExpire(
      `rank:daily`,
      1,
      `user:${userId}`,
      24 * 60 * 60
    );
    // 周榜：7天过期（604800秒）
    await this.redisService.zincrbyWithExpire(
      `rank:weekly`,
      1,
      `user:${userId}`,
      7 * 24 * 60 * 60
    );

    return 'success';
  }

  /**
   * 邮箱脱敏函数
   */
  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    const maskedLocal =
      localPart[0] + '***' + localPart[localPart.length - 1];
    return `${maskedLocal}@${domain}`;
  }

  /**
   * 获取单词排行榜
   */
  async getRanking(
    type: 'total' | 'daily' | 'weekly' = 'total',
    limit: number = 10,
    userId?: number
  ): Promise<RankingResponseDto> {
    const rankingKey = `rank:${type}`;

    // 获取排行榜数据（带分数）
    const rankingsWithScores = await this.redisService.zrevrangeWithScores(
      rankingKey,
      0,
      limit - 1
    );

    const rankings: RankingItemDto[] = [];

    // 处理排行榜数据
    for (let i = 0; i < rankingsWithScores.length; i += 2) {
      const member = rankingsWithScores[i];
      const score = parseInt(rankingsWithScores[i + 1]);

      // 从member中提取用户ID
      const userIdFromMember = parseInt(member.replace('user:', ''));

      try {
        // 获取用户信息
        const user = await this.userService.findOne(userIdFromMember);

        rankings.push({
          userId: user.id,
          userName: user.name,
          userEmail: this.maskEmail(user.email),
          score: score,
          rank: Math.floor(i / 2) + 1
        });
      } catch {
        // 如果用户不存在，跳过该记录
        console.warn(`用户 ${userIdFromMember} 不存在，跳过排行榜记录`);
      }
    }

    // 获取当前用户信息（如果提供了userId）
    let currentUserRank: number | undefined;
    let currentUserScore: number | undefined;

    if (userId) {
      const userMember = `user:${userId}`;
      const rank = await this.redisService.zrevrank(rankingKey, userMember);
      const score = await this.redisService.zscore(rankingKey, userMember);

      if (rank !== null && score !== null) {
        currentUserRank = rank + 1; // Redis排名从0开始，转换为从1开始
        currentUserScore = parseInt(score);
      }
    }

    return {
      type,
      rankings,
      currentUserRank,
      currentUserScore
    };
  }
}
