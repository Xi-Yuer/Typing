import {
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomPackage } from './entities/custom-package.entity';
import { CustomWord } from './entities/custom-word.entity';
import { CreateCustomPackageDto } from './dto/create-custom-package.dto';
import { UpdateCustomPackageDto } from './dto/update-custom-package.dto';
import { CreateCustomWordDto } from './dto/create-custom-word.dto';
import { UpdateCustomWordDto } from './dto/update-custom-word.dto';
import { ImportWordsDto } from './dto/import-words.dto';
import { QueryCustomWordDto } from './dto/query-custom-word.dto';
import { PaginationResponseDto } from '@/common/dto/api-response.dto';

@Injectable()
export class CustomPackagesService {
  constructor(
    @InjectRepository(CustomPackage)
    private customPackageRepository: Repository<CustomPackage>,
    @InjectRepository(CustomWord)
    private customWordRepository: Repository<CustomWord>
  ) {}

  // 创建自定义学习包
  async create(
    createCustomPackageDto: CreateCustomPackageDto,
    userId: string
  ): Promise<CustomPackage> {
    const customPackage = this.customPackageRepository.create({
      ...createCustomPackageDto,
      userId,
      wordCount: 0
    });

    return await this.customPackageRepository.save(customPackage);
  }

  // 获取用户的自定义学习包列表
  async findAllByUser(
    userId: string
  ): Promise<PaginationResponseDto<CustomPackage>> {
    const queryBuilder = this.customPackageRepository
      .createQueryBuilder('package')
      .leftJoinAndSelect('package.user', 'user')
      .where('package.userId = :userId', { userId });

    queryBuilder.orderBy('package.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginationResponseDto(data, total, 1, 10);
  }

  // 获取公开的自定义学习包列表
  async findPublic(): Promise<PaginationResponseDto<CustomPackage>> {
    const queryBuilder = this.customPackageRepository
      .createQueryBuilder('package')
      .leftJoinAndSelect('package.user', 'user')
      .where('package.isPublic = :isPublic', { isPublic: true });

    queryBuilder.orderBy('package.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginationResponseDto(data, total, 1, 10);
  }

  // 根据ID获取自定义学习包
  async findOne(id: string, userId?: string): Promise<CustomPackage> {
    const customPackage = await this.customPackageRepository.findOne({
      where: { id },
      relations: ['user', 'words']
    });

    if (!customPackage) {
      throw new NotFoundException('自定义学习包不存在');
    }

    // 如果不是公开的且不是创建者，则不允许访问
    if (!customPackage.isPublic && customPackage.userId !== userId) {
      throw new ForbiddenException('无权访问此学习包');
    }

    return customPackage;
  }

  // 更新自定义学习包
  async update(
    id: string,
    updateCustomPackageDto: UpdateCustomPackageDto,
    userId: string
  ): Promise<CustomPackage> {
    const customPackage = await this.findOne(id, userId);

    if (customPackage.userId !== userId) {
      throw new ForbiddenException('无权修改此学习包');
    }

    Object.assign(customPackage, updateCustomPackageDto);
    return await this.customPackageRepository.save(customPackage);
  }

  // 删除自定义学习包
  async remove(id: string, userId: string): Promise<void> {
    const customPackage = await this.findOne(id, userId);

    if (customPackage.userId !== userId) {
      throw new ForbiddenException('无权删除此学习包');
    }

    await this.customPackageRepository.softDelete(id);
  }

  // 获取学习包中的单词列表
  async findWordsByPackage(
    packageId: string,
    userId: string,
    queryDto: QueryCustomWordDto
  ): Promise<PaginationResponseDto<CustomWord>> {
    const { page = 1, limit = 10, search } = queryDto;
    const skip = (page - 1) * limit;

    // 先检查学习包是否存在且用户有权限访问
    await this.findOne(packageId, userId);

    const queryBuilder = this.customWordRepository
      .createQueryBuilder('word')
      .where('word.packageId = :packageId', { packageId });

    if (search) {
      queryBuilder.andWhere(
        '(word.word LIKE :search OR word.meaning LIKE :search OR word.meaningShort LIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder
      .orderBy('word.sortOrder', 'ASC')
      .addOrderBy('word.createdAt', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginationResponseDto(data, total, page, limit);
  }

  // 向学习包添加单词
  async addWord(
    packageId: string,
    createCustomWordDto: CreateCustomWordDto,
    userId: string
  ): Promise<CustomWord> {
    // 检查学习包是否存在且用户有权限
    const customPackage = await this.findOne(packageId, userId);

    if (customPackage.userId !== userId) {
      throw new ForbiddenException('无权向此学习包添加单词');
    }

    const customWord = this.customWordRepository.create({
      ...createCustomWordDto,
      packageId
    });

    const savedWord = await this.customWordRepository.save(customWord);

    // 更新学习包的单词数量
    await this.updateWordCount(packageId);

    return savedWord;
  }

  // 更新学习包中的单词
  async updateWord(
    packageId: string,
    wordId: string,
    updateCustomWordDto: UpdateCustomWordDto,
    userId: string
  ): Promise<CustomWord> {
    // 检查学习包是否存在且用户有权限
    const customPackage = await this.findOne(packageId, userId);

    if (customPackage.userId !== userId) {
      throw new ForbiddenException('无权修改此学习包中的单词');
    }

    const customWord = await this.customWordRepository.findOne({
      where: { id: wordId, packageId }
    });

    if (!customWord) {
      throw new NotFoundException('单词不存在');
    }

    Object.assign(customWord, updateCustomWordDto);
    return await this.customWordRepository.save(customWord);
  }

  // 删除学习包中的单词
  async removeWord(
    packageId: string,
    wordId: string,
    userId: string
  ): Promise<void> {
    // 检查学习包是否存在且用户有权限
    const customPackage = await this.findOne(packageId, userId);

    if (customPackage.userId !== userId) {
      throw new ForbiddenException('无权删除此学习包中的单词');
    }

    const customWord = await this.customWordRepository.findOne({
      where: { id: wordId, packageId }
    });

    if (!customWord) {
      throw new NotFoundException('单词不存在');
    }

    await this.customWordRepository.softDelete(wordId);

    // 更新学习包的单词数量
    await this.updateWordCount(packageId);
  }

  // 批量导入单词到学习包
  async importWords(
    packageId: string,
    importWordsDto: ImportWordsDto,
    userId: string
  ): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    // 检查学习包是否存在且用户有权限
    const customPackage = await this.findOne(packageId, userId);

    if (customPackage.userId !== userId) {
      throw new ForbiddenException('无权向此学习包导入单词');
    }

    const { words } = importWordsDto;
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const wordData of words) {
      try {
        // 处理字段映射：translation -> meaning, pronunciation -> transliteration
        const processedData = {
          ...wordData,
          packageId,
          // 如果提供了 translation 但没有 meaning，使用 translation 作为 meaning
          meaning: wordData.meaning || wordData.translation,
          // 如果提供了 pronunciation 但没有 transliteration，使用 pronunciation 作为 transliteration
          transliteration: wordData.transliteration || wordData.pronunciation,
          // 移除前端传递的额外字段，避免数据库错误
          translation: undefined,
          pronunciation: undefined,
          difficulty: undefined,
          category: undefined
        };

        const customWord = this.customWordRepository.create(processedData);

        await this.customWordRepository.save(customWord);
        success++;
      } catch (error) {
        failed++;
        errors.push(`单词 "${wordData.word}" 导入失败: ${error.message}`);
      }
    }

    // 更新学习包的单词数量
    await this.updateWordCount(packageId);

    return {
      success,
      failed,
      errors
    };
  }

  // 更新学习包的单词数量
  private async updateWordCount(packageId: string): Promise<void> {
    const count = await this.customWordRepository.count({
      where: { packageId }
    });

    await this.customPackageRepository.update(packageId, { wordCount: count });
  }
}
