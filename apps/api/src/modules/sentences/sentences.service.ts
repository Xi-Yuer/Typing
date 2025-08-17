import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';
import { Sentence } from './entities/sentence.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginationResponseDto } from '../../common/dto/api-response.dto';

@Injectable()
export class SentencesService {
  constructor(
    @InjectRepository(Sentence)
    private readonly sentenceRepository: Repository<Sentence>,
  ) {}

  /**
   * 创建句子
   */
  async create(createSentenceDto: CreateSentenceDto): Promise<Sentence> {
    // 检查同一语言和分类下是否已存在相同句子
    const existingSentence = await this.sentenceRepository.findOne({
      where: {
        sentence: createSentenceDto.sentence,
        languageId: createSentenceDto.languageId,
        categoryId: createSentenceDto.categoryId,
      },
    });

    if (existingSentence) {
      throw new ConflictException(
        `句子 "${createSentenceDto.sentence}" 在该语言和分类下已存在`,
      );
    }

    const sentence = this.sentenceRepository.create(createSentenceDto);
    return await this.sentenceRepository.save(sentence);
  }

  /**
   * 分页查询句子
   */
  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Sentence>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.sentenceRepository.findAndCount({
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 根据语言 ID 查询句子
   */
  async findByLanguageId(
    languageId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Sentence>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.sentenceRepository.findAndCount({
      where: { languageId },
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 根据分类 ID 查询句子
   */
  async findByCategoryId(
    categoryId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Sentence>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.sentenceRepository.findAndCount({
      where: { categoryId },
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 根据语言 ID 和分类 ID 查询句子
   */
  async findByLanguageAndCategory(
    languageId: string,
    categoryId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Sentence>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.sentenceRepository.findAndCount({
      where: { languageId, categoryId },
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 搜索句子
   */
  async searchSentences(
    keyword: string,
    languageId?: string,
    categoryId?: string,
  ): Promise<Sentence[]> {
    if (!keyword || keyword.trim().length === 0) {
      throw new BadRequestException('搜索关键词不能为空');
    }

    const whereConditions: any = [
      { sentence: Like(`%${keyword}%`) },
      { meaning: Like(`%${keyword}%`) },
    ];

    // 如果指定了语言或分类，添加到搜索条件
    if (languageId || categoryId) {
      whereConditions.forEach((condition: any) => {
        if (languageId) condition.languageId = languageId;
        if (categoryId) condition.categoryId = categoryId;
      });
    }

    return await this.sentenceRepository.find({
      where: whereConditions,
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 分页搜索句子
   */
  async searchSentencesPaginated(
    keyword: string,
    paginationQuery: PaginationQueryDto,
    languageId?: string,
    categoryId?: string,
  ): Promise<PaginationResponseDto<Sentence>> {
    if (!keyword || keyword.trim().length === 0) {
      throw new BadRequestException('搜索关键词不能为空');
    }

    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const whereConditions: any = [
      { sentence: Like(`%${keyword}%`) },
      { meaning: Like(`%${keyword}%`) },
    ];

    // 如果指定了语言或分类，添加到搜索条件
    if (languageId || categoryId) {
      whereConditions.forEach((condition: any) => {
        if (languageId) condition.languageId = languageId;
        if (categoryId) condition.categoryId = categoryId;
      });
    }

    const [list, total] = await this.sentenceRepository.findAndCount({
      where: whereConditions,
      relations: ['language', 'category'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 获取随机句子
   */
  async getRandomSentences(
    count: number = 10,
    languageId?: string,
    categoryId?: string,
  ): Promise<Sentence[]> {
    if (count <= 0 || count > 100) {
      throw new BadRequestException('数量必须在 1-100 之间');
    }

    const queryBuilder = this.sentenceRepository
      .createQueryBuilder('sentence')
      .leftJoinAndSelect('sentence.language', 'language')
      .leftJoinAndSelect('sentence.category', 'category')
      .orderBy('RAND()')
      .limit(count);

    if (languageId) {
      queryBuilder.andWhere('sentence.languageId = :languageId', {
        languageId,
      });
    }

    if (categoryId) {
      queryBuilder.andWhere('sentence.categoryId = :categoryId', {
        categoryId,
      });
    }

    return await queryBuilder.getMany();
  }

  /**
   * 根据 ID 查询句子详情
   */
  async findOne(id: string): Promise<Sentence> {
    const sentence = await this.sentenceRepository.findOne({
      where: { id },
      relations: ['language', 'category'],
    });

    if (!sentence) {
      throw new NotFoundException(`ID 为 ${id} 的句子不存在`);
    }

    return sentence;
  }

  /**
   * 更新句子
   */
  async update(id: string, updateSentenceDto: UpdateSentenceDto): Promise<Sentence> {
    const sentence = await this.findOne(id);

    // 如果更新了句子内容，检查是否与其他句子冲突
    if (updateSentenceDto.sentence && updateSentenceDto.sentence !== sentence.sentence) {
      const existingSentence = await this.sentenceRepository.findOne({
        where: {
          sentence: updateSentenceDto.sentence,
          languageId: updateSentenceDto.languageId || sentence.languageId,
          categoryId: updateSentenceDto.categoryId || sentence.categoryId,
        },
      });

      if (existingSentence && existingSentence.id !== id) {
        throw new ConflictException(
          `句子 "${updateSentenceDto.sentence}" 在该语言和分类下已存在`,
        );
      }
    }

    Object.assign(sentence, updateSentenceDto);
    return await this.sentenceRepository.save(sentence);
  }

  /**
   * 软删除句子
   */
  async remove(id: string): Promise<{ message: string }> {
    const sentence = await this.findOne(id);
    await this.sentenceRepository.softDelete(id);
    return { message: `句子 "${sentence.sentence}" 删除成功` };
  }

  /**
   * 获取语言统计信息
   */
  async getLanguageStats(): Promise<any[]> {
    return await this.sentenceRepository
      .createQueryBuilder('sentence')
      .leftJoin('sentence.language', 'language')
      .select('language.name', 'languageName')
      .addSelect('language.code', 'languageCode')
      .addSelect('COUNT(sentence.id)', 'count')
      .groupBy('language.id')
      .addGroupBy('language.name')
      .addGroupBy('language.code')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  /**
   * 获取分类统计信息
   */
  async getCategoryStats(): Promise<any[]> {
    return await this.sentenceRepository
      .createQueryBuilder('sentence')
      .leftJoin('sentence.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(sentence.id)', 'count')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('count', 'DESC')
      .getRawMany();
  }
}
