import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCorpusCategoryDto } from './dto/create-corpus-category.dto';
import { UpdateCorpusCategoryDto } from './dto/update-corpus-category.dto';
import { CorpusCategory } from './entities/corpus-category.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginationResponseDto } from '../../common/dto/api-response.dto';

@Injectable()
export class CorpusCategoriesService {
  constructor(
    @InjectRepository(CorpusCategory)
    private readonly corpusCategoryRepository: Repository<CorpusCategory>,
  ) {}

  /**
   * 创建语料库分类
   */
  async create(createCorpusCategoryDto: CreateCorpusCategoryDto): Promise<CorpusCategory> {
    // 检查同一语言下是否已存在相同名称的分类
    const existingCategory = await this.corpusCategoryRepository.findOne({
      where: {
        languageId: createCorpusCategoryDto.languageId,
        name: createCorpusCategoryDto.name,
      },
    });

    if (existingCategory) {
      throw new ConflictException(
        `该语言下已存在名为 "${createCorpusCategoryDto.name}" 的分类`,
      );
    }

    const corpusCategory = this.corpusCategoryRepository.create(createCorpusCategoryDto);
    return await this.corpusCategoryRepository.save(corpusCategory);
  }

  /**
   * 获取所有语料库分类
   */
  async findAll(): Promise<CorpusCategory[]> {
    return await this.corpusCategoryRepository.find({
      relations: ['language'],
      order: { createTime: 'DESC' },
    });
  }

  /**
   * 分页查询语料库分类
   */
  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<CorpusCategory>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.corpusCategoryRepository.findAndCount({
      relations: ['language'],
      order: { createTime: 'DESC' },
      skip,
      take: pageSize,
    });

    return new PaginationResponseDto(list, total, page, pageSize);
  }

  /**
   * 根据语言 ID 查询分类
   */
  async findByLanguageId(languageId: string): Promise<CorpusCategory[]> {
    return await this.corpusCategoryRepository.find({
      where: { languageId },
      relations: ['language'],
      order: { difficulty: 'ASC', createTime: 'DESC' },
    });
  }

  /**
   * 根据难度等级查询分类
   */
  async findByDifficulty(difficulty: number): Promise<CorpusCategory[]> {
    if (difficulty < 1 || difficulty > 5) {
      throw new BadRequestException('难度等级必须在 1-5 之间');
    }

    return await this.corpusCategoryRepository.find({
      where: { difficulty },
      relations: ['language'],
      order: { createTime: 'DESC' },
    });
  }

  /**
   * 根据语言 ID 和难度等级查询分类
   */
  async findByLanguageAndDifficulty(
    languageId: string,
    difficulty: number,
  ): Promise<CorpusCategory[]> {
    if (difficulty < 1 || difficulty > 5) {
      throw new BadRequestException('难度等级必须在 1-5 之间');
    }

    return await this.corpusCategoryRepository.find({
      where: { languageId, difficulty },
      relations: ['language'],
      order: { createTime: 'DESC' },
    });
  }

  /**
   * 根据 ID 查询单个分类
   */
  async findOne(id: string): Promise<CorpusCategory> {
    const corpusCategory = await this.corpusCategoryRepository.findOne({
      where: { id },
      relations: ['language'],
    });

    if (!corpusCategory) {
      throw new NotFoundException(`ID 为 ${id} 的语料库分类不存在`);
    }

    return corpusCategory;
  }

  /**
   * 更新语料库分类
   */
  async update(
    id: string,
    updateCorpusCategoryDto: UpdateCorpusCategoryDto,
  ): Promise<CorpusCategory> {
    const corpusCategory = await this.findOne(id);

    // 如果更新了名称，检查是否与同语言下其他分类重名
    if (updateCorpusCategoryDto.name && updateCorpusCategoryDto.name !== corpusCategory.name) {
      const existingCategory = await this.corpusCategoryRepository.findOne({
        where: {
          languageId: corpusCategory.languageId,
          name: updateCorpusCategoryDto.name,
        },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(
          `该语言下已存在名为 "${updateCorpusCategoryDto.name}" 的分类`,
        );
      }
    }

    // 验证难度等级
    if (
      updateCorpusCategoryDto.difficulty &&
      (updateCorpusCategoryDto.difficulty < 1 || updateCorpusCategoryDto.difficulty > 5)
    ) {
      throw new BadRequestException('难度等级必须在 1-5 之间');
    }

    Object.assign(corpusCategory, updateCorpusCategoryDto);
    return await this.corpusCategoryRepository.save(corpusCategory);
  }

  /**
   * 删除语料库分类（软删除）
   */
  async remove(id: string): Promise<void> {
    const corpusCategory = await this.findOne(id);
    await this.corpusCategoryRepository.softDelete(id);
  }

  /**
   * 获取难度等级统计
   */
  async getDifficultyStats(): Promise<{ difficulty: number; count: number }[]> {
    const result = await this.corpusCategoryRepository
      .createQueryBuilder('category')
      .select('category.difficulty', 'difficulty')
      .addSelect('COUNT(*)', 'count')
      .groupBy('category.difficulty')
      .orderBy('category.difficulty', 'ASC')
      .getRawMany();

    return result.map(item => ({
      difficulty: parseInt(item.difficulty),
      count: parseInt(item.count),
    }));
  }

  /**
   * 获取语言分类数量统计
   */
  async getLanguageStats(): Promise<{ languageId: string; languageName: string; count: number }[]> {
    const result = await this.corpusCategoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.language', 'language')
      .select('category.languageId', 'languageId')
      .addSelect('language.name', 'languageName')
      .addSelect('COUNT(*)', 'count')
      .groupBy('category.languageId')
      .addGroupBy('language.name')
      .orderBy('count', 'DESC')
      .getRawMany();

    return result.map(item => ({
      languageId: item.languageId,
      languageName: item.languageName || '未知语言',
      count: parseInt(item.count),
    }));
  }
}